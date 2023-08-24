#ifdef __cplusplus
#import "react-native-rapidsnark.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRapidsnarkSpec.h"

@interface Rapidsnark : NSObject <NativeRapidsnarkSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Rapidsnark : NSObject <RCTBridgeModule>
#endif

@end
