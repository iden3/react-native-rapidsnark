cmake_minimum_required(VERSION 3.4.1)
project(rapidsnark)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 11)

add_library(lib_rapidsnark SHARED)

target_include_directories(lib_rapidsnark INTERFACE ${CMAKE_SOURCE_DIR}/src/libs/${ANDROID_ABI}/include)

set_target_properties(lib_rapidsnark
        PROPERTIES
        IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/src/libs/${ANDROID_ABI}/lib/libcrypto.a
        INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/src/libs/${ANDROID_ABI}/include
        )

