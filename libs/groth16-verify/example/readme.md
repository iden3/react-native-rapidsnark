## Example C program

```shell
cargo build --release --lib
cd example
clang -I ../include example.c ../target/release/libgroth16_verify.a && ./a.out
```

Exit code is 0 on success and 1 on error.
