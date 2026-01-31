#!/bin/sh
#
# Name: clear_queue.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Deletes a queue in RabbitMQ.
#

rabbitmqadmin delete queue name=$1

