import socket
import sys, os
from struct import pack

dirpath = os.getcwd()


def send(args):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((args[2], int(args[3])))

        data = None
        with open(os.path.join(dirpath, args[1]), 'rb') as fp:
            data = fp.read()
        data_len = pack('>Q', len(data))
        filename = pack('>Q', len(args[1].encode()))
        s.send(filename)
        s.send(args[1].encode())
        s.send(data_len)
        s.send(data)


if __name__ == '__main__':
    args = sys.argv
    send(args)
