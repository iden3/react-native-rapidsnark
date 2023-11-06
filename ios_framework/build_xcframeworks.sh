rm -rf ./libfq.xcframework ./libfr.xcframework ./libgmp.xcframework ./Rapidsnark.xcframework

xcodebuild -create-xcframework \
-library libs_ios/libfq.a \
-library libs_sim/libfq.a \
-output libfq.xcframework \
&& \
xcodebuild -create-xcframework \
-library libs_ios/libfr.a \
-library libs_sim/libfr.a \
-output libfr.xcframework \
&& \
xcodebuild -create-xcframework \
-library libs_ios/libgmp.a \
-library libs_sim/libgmp.a \
-output libgmp.xcframework \
&& \
xcodebuild -create-xcframework \
-library libs_ios/librapidsnark.a \
-headers headers/ \
-library libs_sim/librapidsnark.a \
-headers headers/ \
-output Rapidsnark.xcframework
