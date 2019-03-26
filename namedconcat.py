#! python3

import glob
import os
import sys

exts = ['js', 'css', 'html']


def isText(path):
    name, ext = os.path.splitext(path)
    ext = ext[1:]
    return ext in exts


def findRecursive(s):
    return set(glob.glob(path+"/"+s, recursive=True))

# if len(sys.argv) > 1:
    # path = str(sys.argv[1])
# else:


path = os.getcwd()

allPaths = findRecursive("/**/*.*")
libPaths = findRecursive("/**/lib/**/*.*")

scriptPaths = [f for f in allPaths - libPaths if isText(f)]

for f in scriptPaths:
    print(f)
