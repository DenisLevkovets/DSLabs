import socket, os
from struct import unpack
from threading import Thread

clients = []
dirpath = os.getcwd()


# Thread to listen one particular client
class ClientListener(Thread):
    def __init__(self, name: str, sock: socket.socket):
        super().__init__(daemon=True)
        self.sock = sock
        self.name = name

    # add 'me> ' to sended message
    def _clear_echo(self, data):
        # \033[F – symbol to move the cursor at the beginning of current line (Ctrl+A)
        # \033[K – symbol to clear everything till the end of current line (Ctrl+K)
        self.sock.sendall('\033[F\033[Ka'.encode())
        data = 'me> '.encode() + data
        # send the message back to user
        self.sock.sendall(data)

    # clean up
    def _close(self):
        clients.remove(self.sock)
        self.sock.close()
        print(self.name + ' disconnected')

    def run(self):
        while True:
            # try to read 1024 bytes from user
            # this is blocking call, thread will be paused here
            data = self.sock.recv(1024)
            if data:
                self._clear_echo(data)
            else:
                # if we got no data – client has disconnected
                self._close()
                # finish the thread
                return


def checkFileName(filename):
    index = ''
    name = filename.split('.')
    while True:
        if os.path.exists(os.path.join(dirpath,".".join(name[:-1]) + index + '.' + name[-1])):
            if index:
                index = '_copy(' + str(int(index[6:-1]) + 1) + ')'  # Append 1 to number in brackets
            else:
                index = '_copy(1)'
        else:
            return ".".join(name[:-1]) + index + '.' + name[-1]  # Go and try create file again


if __name__ == "__main__":
    next_name = 1

    # AF_INET – IPv4, SOCK_STREAM – TCP
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # reuse address; in OS address will be reserved after app closed for a while
    # so if we close and imidiatly start server again – we'll get error
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    # listen to all interfaces at 8800 port
    sock.bind(('', 8080))
    sock.listen()
    while True:
        # blocking call, waiting for new client to connect
        con, addr = sock.accept()
        fl = con.recv(8)
        (flen,) = unpack('>Q', fl)
        filename = con.recv(flen)
        print(checkFileName(filename.decode('utf-8')))
        bs = con.recv(8)
        (length,) = unpack('>Q', bs)
        data = b''
        while len(data) < length:
            # doing it in batches is generally better than trying
            # to do it all in one go, so I believe.
            to_read = length - len(data)
            data += con.recv(
                4096 if to_read > 4096 else to_read)
        new = open(checkFileName(filename.decode('utf-8')), "w+b")
        new.write(data)
        new.close()

        clients.append(con)
        name = 'u' + str(next_name)
        next_name += 1
        print(str(addr) + ' connected as ' + name)
        # start new thread to deal with client
        ClientListener(name, con).start()
