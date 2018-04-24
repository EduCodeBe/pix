#!/usr/bin/env bash

# Set colors
RESET_COLOR="$(tput sgr0)"
BOLD=$(tput smso)
OFFBOLD=$(tput rmso)

# Colors (bold)
RED="$(tput bold ; tput setaf 1)"
GREEN="$(tput bold ; tput setaf 2)"
YELLOW="$(tput bold ; tput setaf 3)"
BLUE="$(tput bold ; tput setaf 4)"
CYAN="$(tput bold ; tput setaf 6)"

# Common functions
function get_package_version {
    node -p -e "require('./package.json').version"
}

function checkout_dev {
    git checkout dev >> /dev/null 2>&1
}

function fetch_and_rebase {
    git fetch
    git pull --rebase
}
