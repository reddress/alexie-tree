#!/usr/bin/env python

# http://stackoverflow.com/questions/2186525/use-a-glob-to-find-files-recursively-in-python

import fnmatch
import os
# import sys

print('Check if all JavaScript files have "use strict";')

FOLDERS = ['../js'];

all_ok = True

for folder in FOLDERS:
    print("Searching in " + folder);
    for root, dirnames, filenames in os.walk(folder):
        print("\nSearching folder " + root)
        for filename in fnmatch.filter(filenames, '*.js'):
            with open(os.path.join(root, filename)) as js_file:
                # sys.stdout.write("Checking " + filename)
                first_line = js_file.readline().strip();
                if first_line != '"use strict";':
                    print('MISSING "use strict"; ' + os.path.join(root, filename))
                    all_ok = False
if all_ok:
    print("All OK");
