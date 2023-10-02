Level 1

1. Examination

When I started on this challenge, one of the first things I did was run `strings challenge.img | grep TISC`. To my surprise, it yielded the following result: `TISC{w4s_th3r3_s0m3th1ng_l3ft_%s}`. I immediately submitted this flag only to realise that there was a second half.

After running `file challenge.img` I realised that it was a linux ext4 filesystem dump of some sort, and searched online on how to mount the system. I ran `sudo mount -o loop challenge.img /mnt`, and `ls /mnt` showed that it was indeed a linux filesystem.

Next, I tried to find the file where the text was from: `grep -r TISC /mnt`. However, this strangely yielded no results. I looked through the filesystem for quite some time but found nothing interesting, and then eventually speculated that the text could be in a deleted file.
I tried various methods and commands including extundelete, and I could see there were indeed a few orphan nodes. However, these attempts were largely unsuccessful.

Eventually, as I was looking at the strings output again, I noticed the lines before and after the partial flag were quite interesting.

```
/lib/ld-musl-x86_64.so.1
srand
printf
_init
_fini
__cxa_finalize
__libc_start_main
libc.musl-x86_64.so.1
__deregister_frame_info
_ITM_registerTMCloneTable
_ITM_deregisterTMCloneTable
__register_frame_info
uCUH
t"UH
TISC{w4s_th3r3_s0m3th1ng_l3ft_%s}
;*3$"
GCC: (Alpine 12.2.1_git20220924-r10) 12.2.1 20220924
_init
long unsigned int
_start_c
double
argc
__libc_start_main
long long int

```

This looks like an elf binary, and sure enough, when I run strings on another elf binary it produced similar output.

Fortunately, it seems the file is stored on a contiguous chunk of memory, so I just need to identify the start and end of the file to be able to extract it. I took a look at the elf format guide on https://en.wikipedia.org/wiki/Executable_and_Linkable_Format.

To find the start of the file, I simply search for the elf magic number that comes before ‘TISC{‘:

```:s.py
with open('challenge.img', 'rb') as f:
    data = f.read()

i = data.find(b'TISC{')
start = data.rfind(b'\x7fELF', 0, i)
```

To find the end index requires a bit more information from the header. https://stackoverflow.com/questions/2995347/how-can-i-find-the-size-of-a-elf-file-image-with-header-information tells me that I have to use the formula `e_shoff + (e_shnum * e_shentsize)`, and by referring to the header format specification table, I come up with the following code:

```:s.py
…
def to_int(b: bytes) -> int:
    return (b[1] << 8) + b[0]

e_shoff = to_int(data[start+0x28 : start+0x30])
e_shentsize = to_int(data[start+0x3a : start+0x3c])
e_shnum = to_int(data[start+0x3c : start+0x3e])

size = e_shoff + (e_shnum * e_shentsize)
elf = data[start : start+size]

with open('bin', 'wb') as f:
    f.write(elf)
```

Running the file with `chmod +x bin` and `./bin` produced an error because I did not have the musl libc library installed. I installed it with `sudo apt install musl-dev`, and then ran `./bin` again, and the flag was printed!

`TISC{w4s_th3r3_s0m3th1ng_l3ft_ubrekeslydsqdpotohujsgpzqiojwzfq}`