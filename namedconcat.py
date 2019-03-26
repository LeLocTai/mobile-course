#! python3

import glob
import os
import sys

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("inDir")
args = parser.parse_args()

inDir = os.path.abspath(args.inDir)
outPath = os.path.abspath(os.path.basename(inDir)+".txt")

exts = ['js', 'css', 'html']


def isText(path):
    _, ext = os.path.splitext(path)
    ext = ext[1:]  # remove dot
    return ext in exts


def findRecursive(s):
    return set(glob.glob(inDir + "/" + s, recursive=True))


def writeOut(inPaths, outPath):
    outfile = open(outPath, 'w')

    for path in inPaths:
        relpath = os.path.relpath(path, start=inDir)
        print("Adding: " + relpath)        
        outfile.write("//" + relpath + "\n\n")

        inFile = open(path)
        for line in inFile:
            outfile.write(line)
        inFile.close()

        outfile.write('\n\n')

    outfile.close()


allPaths = findRecursive("/**/*.*")
libPaths = findRecursive("/**/lib/**/*.*")

scriptPaths = [f for f in allPaths - libPaths if isText(f)]

writeOut(sorted(scriptPaths), outPath)
