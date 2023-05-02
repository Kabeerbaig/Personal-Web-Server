#!/bin/bash

# variables
preload=/home/courses/cs3214/bin/sfi/gurthang/gurthang-preload.so
server=/home/ugrads/majors/jtomas/3214/pserv/src/server-fuzz

# input check
if [ $# -lt 1 ]; then
    echo "Usage: $0 /path/to/crash/file"
    exit 1
fi
fpath=$1

# running
LD_PRELOAD=${preload} gdb ${server} -ex "set args -p 59609 -R /home/ugrads/majors/jtomas/3214/pserv/src/fuzz_root  < ${fpath}" -ex "echo [38;2;255;174;52mfuzz-rerun-gdb.sh: Arguments are set. Type 'run' to reproduce the crash/hang.
"[0m
