# This scripts creates merged library for arm64 only for both sim and ios, and then creates xcframework from it.

rm -rf ./Rapidsnark.xcframework

libtool -static -o libs_ios/librapidsnarkmerged.a libs_ios/libfq.a libs_ios/libfr.a libs_ios/libgmp.a libs_ios/librapidsnark.a -arch_only arm64 \
&& \
libtool -static -o libs_sim/librapidsnarkmerged.a libs_sim/libfq.a libs_sim/libfr.a libs_sim/libgmp.a libs_sim/librapidsnark.a \
&& \
xcodebuild -create-xcframework \
-library libs_ios/librapidsnarkmerged.a \
-library libs_sim/librapidsnarkmerged.a \
-output Rapidsnark.xcframework \
&& \
cp -rf ./Rapidsnark.xcframework ../ios/Frameworks
