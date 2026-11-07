package hu.csaladivakacio;

import android.content.Context;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;

/**
 * Háttérfrissítő: a játékfájlokat (HTML, JS, ikonok) a weboldalról tölti le az alkalmazás saját tárhelyére,
 * fájlonként ellenőrzi a méretüket a version.json alapján, és csak ha minden rendben, akkor vált át rájuk.
 * Új APK-t csak akkor kell telepíteni, ha a version.json "apk" száma nagyobb, mint ennek az alkalmazásnak a NATIVE_REV-je.
 */
final class Updater {
    static final String SITE = "https://strattila90-hue.github.io/Ede-kaland-/";

    enum Kind { NONE, READY, NEED_APK, FAIL }

    static final class Result {
        final Kind kind; final String version; final String msg;
        Result(Kind k, String v, String m) { kind = k; version = v; msg = m; }
    }

    private Updater() { }

    private static File root(Context c) { return new File(c.getFilesDir(), "www"); }
    private static File pointer(Context c) { return new File(c.getFilesDir(), "www-current.txt"); }

    /** a beépített (APK-ban lévő) játék verziója */
    static String assetVersion(Context c) {
        try (InputStream in = c.getAssets().open("www/version.json")) {
            return new JSONObject(new String(readAll(in), StandardCharsets.UTF_8)).optString("version", "0");
        } catch (Exception e) { return "0"; }
    }

    /** a letöltött, átváltásra kész verzió (vagy null) */
    static String stagedVersion(Context c) {
        try {
            File p = pointer(c);
            if (!p.isFile()) return null;
            String v = new String(readAll(new FileInputStream(p)), StandardCharsets.UTF_8).trim();
            return new File(root(c), v).isDirectory() ? v : null;
        } catch (Exception e) { return null; }
    }

    /** ebből a mappából fut a játék (null = a beépített fájlokból) */
    static File liveDir(Context c) {
        String s = stagedVersion(c);
        if (s == null || cmp(s, assetVersion(c)) <= 0) return null;
        return new File(root(c), s);
    }

    static String contentVersion(Context c) {
        String a = assetVersion(c), s = stagedVersion(c);
        return s != null && cmp(s, a) > 0 ? s : a;
    }

    /** induláskor: a nem használt régi letöltések törlése; ha az APK újabb, mint a letöltött, a letöltött is megy */
    static void cleanup(Context c) {
        File live = liveDir(c);
        File[] all = root(c).listFiles();
        if (all == null) return;
        for (File f : all) if (live == null || !f.equals(live)) delete(f);
        if (live == null) pointer(c).delete();
    }

    static Result check(Context c) {
        try {
            JSONObject v = new JSONObject(new String(get(SITE + "version.json?t=" + System.currentTimeMillis()), StandardCharsets.UTF_8));
            String nv = v.getString("version");
            if (v.optInt("apk", 1) > BuildConfig.NATIVE_REV) return new Result(Kind.NEED_APK, nv, null);
            if (cmp(nv, contentVersion(c)) <= 0) return new Result(Kind.NONE, contentVersion(c), null);
            File tmp = new File(root(c), "tmp-" + nv);
            delete(tmp);
            if (!tmp.mkdirs()) return new Result(Kind.FAIL, nv, "mappa");
            JSONObject files = v.getJSONObject("files");
            for (Iterator<String> it = files.keys(); it.hasNext(); ) {
                String name = it.next();
                if (name.contains("..")) continue;
                long size = files.getLong(name);
                byte[] data = get(SITE + name + "?v=" + nv + "&t=" + System.currentTimeMillis());
                if (data.length != size) { delete(tmp); return new Result(Kind.FAIL, nv, name + " " + data.length + "/" + size); }
                File f = new File(tmp, name);
                File dir = f.getParentFile();
                if (dir != null) dir.mkdirs();
                try (OutputStream os = new FileOutputStream(f)) { os.write(data); }
            }
            try (OutputStream os = new FileOutputStream(new File(tmp, "version.json"))) { os.write(v.toString().getBytes(StandardCharsets.UTF_8)); }
            File dst = new File(root(c), nv);
            delete(dst);
            if (!tmp.renameTo(dst)) { delete(tmp); return new Result(Kind.FAIL, nv, "átnevezés"); }
            try (OutputStream os = new FileOutputStream(pointer(c))) { os.write(nv.getBytes(StandardCharsets.UTF_8)); }
            return new Result(Kind.READY, nv, null);
        } catch (Exception e) {
            return new Result(Kind.FAIL, null, String.valueOf(e.getMessage()));
        }
    }

    static final String APK_URL = "https://github.com/strattila90-hue/Ede-kaland-/releases/download/apk/csaladi-vakacio.apk";

    static File apkFile(Context c) { return new File(new File(c.getCacheDir(), "apk"), "csaladi-vakacio.apk"); }

    /** az új APK letöltése a gyorsítótárba; null = sikerült, különben a hiba szövege */
    static String downloadApk(Context c) {
        try {
            byte[] d = get(APK_URL + "?t=" + System.currentTimeMillis());
            if (d.length < 100000 || d[0] != 'P' || d[1] != 'K') return "hibás letöltés (" + d.length + " bájt)";
            File f = apkFile(c), dir = f.getParentFile();
            if (dir != null) dir.mkdirs();
            File tmp = new File(dir, "letoltes.tmp");
            try (OutputStream os = new FileOutputStream(tmp)) { os.write(d); }
            f.delete();
            if (!tmp.renameTo(f)) return "átnevezés";
            return null;
        } catch (Exception e) { return String.valueOf(e.getMessage()); }
    }

    static String mime(String name) {
        String n = name.toLowerCase();
        if (n.endsWith(".html")) return "text/html";
        if (n.endsWith(".js")) return "application/javascript";
        if (n.endsWith(".json")) return "application/json";
        if (n.endsWith(".webmanifest")) return "application/manifest+json";
        if (n.endsWith(".png")) return "image/png";
        if (n.endsWith(".svg")) return "image/svg+xml";
        if (n.endsWith(".css")) return "text/css";
        return "application/octet-stream";
    }

    static int cmp(String a, String b) {
        String[] x = a.split("\\."), y = b.split("\\.");
        for (int i = 0; i < Math.max(x.length, y.length); i++) {
            int p = i < x.length ? num(x[i]) : 0, q = i < y.length ? num(y[i]) : 0;
            if (p != q) return p < q ? -1 : 1;
        }
        return 0;
    }

    private static int num(String s) { try { return Integer.parseInt(s.replaceAll("\\D", "")); } catch (Exception e) { return 0; } }

    private static byte[] get(String url) throws Exception {
        HttpURLConnection h = (HttpURLConnection) new URL(url).openConnection();
        h.setUseCaches(false);
        h.setConnectTimeout(15000);
        h.setReadTimeout(30000);
        h.setRequestProperty("Cache-Control", "no-cache");
        try {
            if (h.getResponseCode() != 200) throw new Exception("HTTP " + h.getResponseCode() + " " + url);
            try (InputStream in = h.getInputStream()) { return readAll(in); }
        } finally { h.disconnect(); }
    }

    private static byte[] readAll(InputStream in) throws Exception {
        try (InputStream i = in) {
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] b = new byte[16384];
            int n;
            while ((n = i.read(b)) > 0) bo.write(b, 0, n);
            return bo.toByteArray();
        }
    }

    private static void delete(File f) {
        if (f == null || !f.exists()) return;
        File[] k = f.listFiles();
        if (k != null) for (File x : k) delete(x);
        f.delete();
    }
}
