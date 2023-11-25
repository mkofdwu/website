# 1. Fixing the apk

When I first tried to decompile the apk with jadx, it produced an error and failed to decompile correctly. I remembered from the challenge description that "some of the last few bytes got corrupted", so I knew I had to fix the file before decompiling it. I searched for an apk file format specification online but realised an apk is a zip archive, so I used the specification [here](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip-printable.html) and edited the file using ghex.

Referring to the "end of central directory record" section, I realised that the comment length was set to \x0a\x00 = 10 bytes, although the challenge description specified "the file shouldn't have any comments". Hence, I just changed the byte to 0 and decompiled the modified apk. This time, it decompiled without errors.

# 2. Static analysis

Next, I found MainActivity.java under sources/com/tisc/kappa/MainActivity.java, and I noticed an interesting method.

```java:MainActivity.java
public void M(String str) {
    char[] charArray = str.toCharArray();
    String valueOf = String.valueOf(charArray);
    for (int i2 = 0; i2 < 1024; i2++) {
        valueOf = N(valueOf, "SHA1");
    }
    if (!valueOf.equals("d8655ddb9b7e6962350cc68a60e02cc3dd910583")) {
        ((TextView) findViewById(d.f3935f)).setVisibility(4);
        Q(d.f3930a, 3000);
        return;
    }
    char[] copyOf = Arrays.copyOf(charArray, charArray.length);
    charArray[0] = (char) ((copyOf[24] * 2) + 1);
    charArray[1] = (char) (((copyOf[23] - 1) / 4) * 3);
    charArray[2] = Character.toLowerCase(copyOf[22]);
    charArray[3] = (char) (copyOf[21] + '&');
    charArray[4] = (char) ((Math.floorDiv((int) copyOf[20], 3) * 5) + 4);
    charArray[5] = (char) (copyOf[19] - 1);
    charArray[6] = (char) (copyOf[18] + '1');
    charArray[7] = (char) (copyOf[17] + 18);
    charArray[8] = (char) ((copyOf[16] + 19) / 3);
    charArray[9] = (char) (copyOf[15] + '%');
    charArray[10] = (char) (copyOf[14] + '2');
    charArray[11] = (char) (((copyOf[13] / 5) + 1) * 3);
    charArray[12] = (char) ((Math.floorDiv((int) copyOf[12], 9) + 5) * 9);
    charArray[13] = (char) (copyOf[11] + 21);
    charArray[14] = (char) ((copyOf[10] / 2) - 6);
    charArray[15] = (char) (copyOf[9] + 2);
    charArray[16] = (char) (copyOf[8] - 24);
    charArray[17] = (char) (copyOf[7] + Math.pow(4.0d, 2.0d));
    charArray[18] = (char) ((copyOf[6] - '\t') / 2);
    charArray[19] = (char) (copyOf[5] + '\b');
    charArray[20] = copyOf[4];
    charArray[21] = (char) (copyOf[3] - '\"');
    charArray[22] = (char) ((copyOf[2] * 2) - 20);
    charArray[23] = (char) ((copyOf[1] / 2) + 8);
    charArray[24] = (char) ((copyOf[0] + 1) / 2);
    P("The secret you want is TISC{" + String.valueOf(charArray) + "}", "CONGRATULATIONS!", "YAY");
}
```

Unfortunately, it seems that `str` is user-entered, and there is no way to reverse the sha1 hashes, hence we have to look elsewhere. At this point, I installed the apk on my phone, and saw that there was the following dialog:

![Screenshot of the app](/kpa-screenshot.jpg)

I realised this is loaded by the onResume method: 

```java:MainActivity.java
@Override // androidx.fragment.app.e, android.app.Activity
public void onResume() {
    super.onResume();
    O(j1.c.f3928a);
    new j1.b();
    if (j1.b.e()) {
        P("Suspicious device detected!", "CHECK FAILED", "BYE");
    }
    PackageManager packageManager = getPackageManager();
    new j1.a();
    if (j1.a.a(packageManager) == 20) {
        O(j1.c.f3929b);
        setContentView(e.f3937b);
        new sw();
        sw.a();
        ((Button) findViewById(d.f3934e)).setOnClickListener(new c());
        return;
    }
    O(j1.c.f3928a);
    setContentView(e.f3936a);
    if (j1.b.e()) {
        return;
    }
    ((TextView) findViewById(d.f3932c)).setAlpha(1.0f);
    ((TextView) findViewById(d.f3933d)).setAlpha(1.0f);
}
```

It seems that some conditions are being checked, and depending on the outcome `setContentView` will be called with either `e.f3937b` or `e.f3936a`. I looked at the e.java class to find:

```java:e.java
package j1;
/* loaded from: classes.dex */
public abstract class e {

    /* renamed from: a  reason: collision with root package name */
    public static int f3936a = 2131427356;

    /* renamed from: b  reason: collision with root package name */
    public static int f3937b = 2131427358;
}
```

Now we need to find the layout file with these ids. By conducting a global search for the hex value of these ids, I found these lines in resources/res/values/public.xml:

```xml:public.xml
<public type="layout" name="activity_main" id="0x7f0b001c" />
<public type="layout" name="debug_activity_main" id="0x7f0b001e" />
```

`activity_main` seems to be the layout that was loaded when I opened the app, however if the `j1.a.a(packageManager) == 20` condition is satisfied (it seems to check that a certain list of 20 packages are installed), `debug_activity_main` is loaded instead. I found the layout file under resources/res/layout/debug_activity_main.xml:

```xml:debug_activity_main.xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto" android:background="#8bffb8" android:layout_width="match_parent" android:layout_height="match_parent">
    <TextView android:textSize="18sp" android:id="@+id/textView2" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="The secret you seek was just written somewhere..." android:textAlignment="center" app:layout_constraintBottom_toBottomOf="0" app:layout_constraintEnd_toEndOf="0" app:layout_constraintStart_toStartOf="0" app:layout_constraintTop_toTopOf="0" app:layout_constraintVertical_bias="0.366"/>
    <TextView android:textSize="34sp" android:typeface="normal" android:textStyle="bold" android:textColor="#292929" android:id="@+id/textView" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Welcome to KaPpA!" android:autoText="false" android:textAllCaps="false" app:layout_constraintBottom_toBottomOf="0" app:layout_constraintEnd_toEndOf="0" app:layout_constraintStart_toStartOf="0" app:layout_constraintTop_toTopOf="0" app:layout_constraintVertical_bias="0.189"/>
    <Button android:id="@+id/submitButton" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="18dp" android:text="Submit!" android:layout_marginStart="157dp" android:layout_marginEnd="157dp" app:layout_constraintEnd_toEndOf="0" app:layout_constraintStart_toStartOf="0" app:layout_constraintTop_toBottomOf="@+id/inputText"/>
    <EditText android:id="@+id/inputText" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="102dp" android:layout_marginBottom="18dp" android:hint="Think you found it?" android:ems="10" android:inputType="text" android:textAlignment="center" android:layout_marginStart="100dp" android:layout_marginEnd="102dp" app:layout_constraintBottom_toTopOf="@+id/submitButton" app:layout_constraintEnd_toEndOf="0" app:layout_constraintStart_toStartOf="0" app:layout_constraintTop_toBottomOf="@+id/textView2" style="@style/Widget.AppCompat.EditText"/>
    <TextView android:textSize="20sp" android:textColor="#009688" android:id="@+id/success" android:visibility="invisible" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="56dp" android:text="Getting there..." android:layout_marginStart="160dp" android:layout_marginEnd="160dp" app:layout_constraintEnd_toEndOf="0" app:layout_constraintHorizontal_bias="0.503" app:layout_constraintStart_toStartOf="0" app:layout_constraintTop_toBottomOf="@+id/submitButton"/>
    <TextView android:textSize="20sp" android:textColor="#e91e63" android:id="@+id/failure" android:visibility="invisible" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="76dp" android:text="That&apos;s not right..." android:layout_marginEnd="128dp" app:layout_constraintEnd_toEndOf="0" app:layout_constraintTop_toBottomOf="@+id/submitButton"/>
</androidx.constraintlayout.widget.ConstraintLayout>
```

So this is where the user keys in the secret, which is passed to the method we saw earlier. There is an important hint "The secret you seek was just written somewhere". Initially I thought it had been written to a file, so I took another look at the java code near where `setContentView` is called. the lines `new sw(); sw.a();` seemed interesting, so I looked at sw.java:

```java:sw.java
package com.tisc.kappa;
/* loaded from: classes.dex */
public class sw {
    static {
        System.loadLibrary("kappa");
    }

    public static void a() {
        try {
            System.setProperty("KAPPA", css());
        } catch (Exception unused) {
        }
    }

    private static native String css();
}
```

Maybe the secret is stored in the kappa library, perhaps its written to a file when the library is loaded? I found the `libkappa.so` file under `resources/lib/x86_64/libkappa.so` and began to analyse it. I tried running strings and attempted to decompile it, however this wasn't successful. In the end, I used a more dynamic approach.

I simply created a new android app, copying the contents of `resources/lib` over to `jniLibs`, and copying the `sw.java` file. I created a separate line, `String s = css();`, and added a breakpoint right after that. When I debugged the app, I could see the secret in the variable `s`: `"ArBraCaDabra?KAPPACABANA!"`

Now its just a matter of running the above method (`M`) to transform the string and print the flag. I made a few modifications to the code, and ran it on an online java compiler.

```java:s.java
import java.util.Arrays;

public class HelloWorld {
    public static void main(String[] args) {
        String str = "ArBraCaDabra?KAPPACABANA!";
        char[] charArray = str.toCharArray();
        String valueOf = String.valueOf(charArray);
        char[] copyOf = Arrays.copyOf(charArray, charArray.length);
        charArray[0] = (char) ((copyOf[24] * 2) + 1);
        charArray[1] = (char) (((copyOf[23] - 1) / 4) * 3);
        charArray[2] = Character.toLowerCase(copyOf[22]);
        charArray[3] = (char) (copyOf[21] + '&');
        charArray[4] = (char) ((Math.floorDiv((int) copyOf[20], 3) * 5) + 4);
        charArray[5] = (char) (copyOf[19] - 1);
        charArray[6] = (char) (copyOf[18] + '1');
        charArray[7] = (char) (copyOf[17] + 18);
        charArray[8] = (char) ((copyOf[16] + 19) / 3);
        charArray[9] = (char) (copyOf[15] + '%');
        charArray[10] = (char) (copyOf[14] + '2');
        charArray[11] = (char) (((copyOf[13] / 5) + 1) * 3);
        charArray[12] = (char) ((Math.floorDiv((int) copyOf[12], 9) + 5) * 9);
        charArray[13] = (char) (copyOf[11] + 21);
        charArray[14] = (char) ((copyOf[10] / 2) - 6);
        charArray[15] = (char) (copyOf[9] + 2);
        charArray[16] = (char) (copyOf[8] - 24);
        charArray[17] = (char) (copyOf[7] + Math.pow(4.0d, 2.0d));
        charArray[18] = (char) ((copyOf[6] - '\t') / 2);
        charArray[19] = (char) (copyOf[5] + '\b');
        charArray[20] = copyOf[4];
        charArray[21] = (char) (copyOf[3] - '\"');
        charArray[22] = (char) ((copyOf[2] * 2) - 20);
        charArray[23] = (char) ((copyOf[1] / 2) + 8);
        charArray[24] = (char) ((copyOf[0] + 1) / 2);
        System.out.println("The secret you want is TISC{" + String.valueOf(charArray) + "}");
    }
}
```

The flag was printed out: `TISC{C0ngr@tS!us0lv3dIT,KaPpA!}`
