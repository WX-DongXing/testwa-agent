#!/usr/bin/env python
# -*- coding: utf-8 -*-

from invoke import task
from invoke import run as local

''' mac '''
@task
def package_mac(c):
    print('------------------------------------------------------------------------------------')
    print('|                                                                                  |')
    print('|                            Testwa Auto Package At Mac                            |')
    print('|                                                                                  |')
    print('|                                                                                  |')
    print('|---------------------------- Delete Current Jar File -----------------------------|')
    print('|                                                                                  |')
    local('rm -rf static/java/TestwaJar.jar')
    print('|                                                                                  |')
    print('|-------------------------- Move Jar File To Target File --------------------------|')
    print('|                                                                                  |')
    print('|                                                                                  |')
    local('cp /Users/xd/Testwa/mac/TestwaJar-mac.jar static/java/TestwaJar.jar')
    print('|                                                                                  |')
    print('|                                                                                  |')
    print('|------------------------------ Clear Useless Files -------------------------------|')
    print('|                                                                                  |')
    local('rm -rf dist/')
    print('|                                                                                  |')
    print('|--------------------------- Start To Package Application -------------------------|')
    print('|                                                                                  |')
    local('yarn package-mac')
    print('|                                                                                  |')
    print('------------------------------------------------------------------------------------')
    print('|                                                                                  |')
    print('|                              Auto Package Completed                              |')
    print('|                                                                                  |')
    print('------------------------------------------------------------------------------------')


''' linux '''
@task
def package_linux(c):
    print('------------------------------------------------------------------------------------')
    print('|                                                                                  |')
    print('|                           Testwa Auto Package At Linux                           |')
    print('|                                                                                  |')
    print('|                                                                                  |')
    print('|---------------------------- Delete Current Jar File -----------------------------|')
    print('|                                                                                  |')
    local('rm -rf static/java/TestwaJar.jar')
    print('|                                                                                  |')
    print('|-------------------------- Move Jar File To Target File --------------------------|')
    print('|                                                                                  |')
    print('|                                                                                  |')
    local('cp /Users/xd/Testwa/linux/TestwaJar-linux.jar static/java/TestwaJar.jar')
    print('|                                                                                  |')
    print('|                                                                                  |')
    print('|------------------------------ Clear Useless Files -------------------------------|')
    print('|                                                                                  |')
    local('rm -rf dist/')
    print('|                                                                                  |')
    print('|--------------------------- Start To Package Application -------------------------|')
    print('|                                                                                  |')
    local('yarn package-linux')
    print('|                                                                                  |')
    print('------------------------------------------------------------------------------------')
    print('|                                                                                  |')
    print('|                              Auto Package Completed                              |')
    print('|                                                                                  |')
    print('------------------------------------------------------------------------------------')