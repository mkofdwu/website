I usually avoid the crypto category in ctfs, and hence approached this level with a certain apprehension. Fortunately, it was pretty manageable.

After reading through the code, I saw that the gcm encryption algorithm was being used. Being unfamiliar with this algorithm, I did some research on it and studied how it works.

![GCM diagram](/reckless-mistake-gcm-diagram.png)

At first, I did not look at the above diagram carefully and mistakenly thought that the ciphertext blocks were all being xored to produce the tag (the result was in fact passed through a hash function each time). I wrote a program to test this and it didnt work, and I realised my mistake.

After further thinking, I thought that there seemed to be no vulnerabilites in way gcm was being used, so I scrutinized other parts of the code.

`verify_password` seems to be secure since it is impossible to reverse sha256.

Then I looked at `initialise_key`. Firstly, `arr` is of length 20 and fixed by the seed. Since the seed is provided, we also know `arr`.

```c:prog.c
const char *seed = "PALINDROME IS THE BEST!";

...

uint256_t arr[20] = { 0 };

calculate_sha256((unsigned char *) arr, (unsigned char *) seed, strlen(seed));

for (i = 1; i < 20; i++) {
    calculate_sha256((unsigned char *)(arr+i), (unsigned char *) (arr+i-1), 32);
}
```

Then the key is generated as follows:

```c:prog.c
for (i = 0; i < password_length; i++) {
    int ch = password[i];
    for (j = 0; j < 8; j++) {
        counter = counter % 20;

        if (ch & 0x1) {
            accumulate_xor(key256, arr+counter);
        }

        ch = ch >> 1;
        counter++;
    }
}
```

But the key is just the same 20 `uint256`s are being xored over and over again. Since `x ^ x = 0`, the key is just xor of any number of the 20 `uint256`s. So there are 2^20 = 1048576 possible keys. This is a very small key space!

I modified the c code to brute force the key, just changing certain parameters in `gcm_encrypt` so that it decrypts instead.

```c:s.c
#include <stdio.h>
#include <termios.h>
#include <unistd.h>
#include <string.h>

#include <openssl/evp.h>
#include <openssl/bio.h>
#include <openssl/err.h>
#include <openssl/sha.h>
#include <openssl/conf.h>

#define OPENSSL_ENGINE NULL

typedef struct uint256 {
    uint64_t a0;
    uint64_t a1;
    uint64_t a2;
    uint64_t a3;
} uint256_t;

void handleErrors(void)
{
    ERR_print_errors_fp(stderr);
    abort();
}

void calculate_sha256(unsigned char *digest_buf, unsigned char *msg, int msglen) {
    EVP_MD_CTX *mdCtx = EVP_MD_CTX_new();

    unsigned int mdLen, i;

    if (!EVP_DigestInit_ex(mdCtx, EVP_sha256(), OPENSSL_ENGINE))
    {
        printf("Message digest initialization failed.\n");
        EVP_MD_CTX_free(mdCtx);
        exit(EXIT_FAILURE);
    }

    // Hashes cnt bytes of data at d into the digest context mdCtx
    if (!EVP_DigestUpdate(mdCtx, msg, msglen))
    {
        printf("Message digest update failed.\n");
        EVP_MD_CTX_free(mdCtx);
        exit(EXIT_FAILURE);
    }

    if (!EVP_DigestFinal_ex(mdCtx, digest_buf, &mdLen))
    {
        printf("Message digest finalization failed.\n");
        EVP_MD_CTX_free(mdCtx);
        exit(EXIT_FAILURE);
    }
    EVP_MD_CTX_free(mdCtx);
}

void accumulate_xor(uint256_t *result, uint256_t *arr_entry) {
    result->a0 ^= arr_entry->a0;
    result->a1 ^= arr_entry->a1;
    result->a2 ^= arr_entry->a2;
    result->a3 ^= arr_entry->a3;
}

int gcm_decrypt(unsigned char *ciphertext, int ciphertext_len,
                unsigned char *aad, int aad_len,
                unsigned char *tag,
                unsigned char *key,
                unsigned char *iv, int iv_len,
                unsigned char *plaintext)
{
    EVP_CIPHER_CTX *ctx;
    int len;
    int plaintext_len;
    int ret;

    /* Create and initialise the context */
    if(!(ctx = EVP_CIPHER_CTX_new()))
        handleErrors();

    /* Initialise the decryption operation. */
    if(!EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL))
        handleErrors();

    /* Set IV length. Not necessary if this is 12 bytes (96 bits) */
    if(!EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, iv_len, NULL))
        handleErrors();

    /* Initialise key and IV */
    if(!EVP_DecryptInit_ex(ctx, NULL, NULL, key, iv))
        handleErrors();

    /*
     * Provide any AAD data. This can be called zero or more times as
     * required
     */
    if(!EVP_DecryptUpdate(ctx, NULL, &len, aad, aad_len))
        handleErrors();

    /*
     * Provide the message to be decrypted, and obtain the plaintext output.
     * EVP_DecryptUpdate can be called multiple times if necessary
     */
    if(!EVP_DecryptUpdate(ctx, plaintext, &len, ciphertext, ciphertext_len))
        handleErrors();
    plaintext_len = len;

    /* Set expected tag value. Works in OpenSSL 1.0.1d and later */
    if(!EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, 16, tag))
        handleErrors();

    /*
     * Finalise the decryption. A positive return value indicates success,
     * anything else is a failure - the plaintext is not trustworthy.
     */
    ret = EVP_DecryptFinal_ex(ctx, plaintext + len, &len);

    /* Clean up */
    EVP_CIPHER_CTX_free(ctx);

    if(ret > 0) {
        /* Success */
        plaintext_len += len;
        return plaintext_len;
    } else {
        /* Verify failed */
        return -1;
    }
}

int test_key(unsigned char *key) {
    int plaintext_length;
    unsigned char *iv = "PALINDROME ROCKS";
    unsigned char plaintext[128] = { 0 };
    const unsigned char * const header = "welcome_message";
    unsigned char ciphertext[] =
        "\xad\xac\x81\x20\xc6\xd5\xb1\xb8\x3a\x2a\xa8\x54\xe6\x5f\x9a\xad"
        "\xa4\x39\x05\xd9\x21\xae\xab\x50\x98\xbd\xe4\xc8\xe8\x2a\x3c\x63"
        "\x82\xe3\x8e\x5d\x79\xf0\xc6\xf4\xf2\xe7";
    unsigned char tag[] =
        "\xbd\xfc\xc0\xdb\xd9\x09\xed\x66\x37\x34\x75\x11\x75\xa2\x7a\xaf";

    plaintext_length = gcm_decrypt(ciphertext, 
                42,
                (unsigned char *)header,
                strlen(header),
                tag,
                key, 
                iv,
                16,
                plaintext);

    if (plaintext_length > 0) {
        printf("plaintext: %.*s\n", plaintext_length, plaintext);
    }
    return plaintext_length;
    // printf("Welcome PALINDROME member. Your secret message is %.*s\n", plaintext_length, plaintext);
}

void brute_force() {
    const char *seed = "PALINDROME IS THE BEST!";
    int i, j, temp, res;

    unsigned char key[32];
    uint256_t *key256  = (uint256_t *)key;

    uint256_t arr[20] = { 0 };
    calculate_sha256((unsigned char *) arr, (unsigned char *) seed, strlen(seed));
    for (i = 1; i < 20; i++) {
        calculate_sha256((unsigned char *)(arr+i), (unsigned char *) (arr+i-1), 32);
    }

    for (i = 0; i < 1048576; i++) {
        key256->a0 = 0;
        key256->a1 = 0;
        key256->a2 = 0;
        key256->a3 = 0;

        temp = i;
        for (j = 0; j < 20; j++) {
            if (temp & 0x1) {
                accumulate_xor(key256, arr+j);
            }
            temp = temp >> 1;
        }

        // check key
        res = test_key((unsigned char *)key);
        if (res != -1) {
            break;
        }
    }
}

int main(int argc, char* argv[]) {
    brute_force();
    return 0;
}
```

Compile the program and run, and in a few seconds we get the flag: `TISC{K3ysP4ce_1s_t00_smol_d2g7d97agsd8yhr}`