import net from 'net';

const getFreePort = (testPort) => {
    const checkPort = (port, resolve) => {
        const srv = net.createServer();
        srv.listen(port, () => {
            const freePort = srv.address().port;
            srv.close();
            resolve(freePort);
        });

        srv.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                // console.log(`Port ${port} in use, retrying...`);

                setTimeout(() => {
                    srv.close();
                    checkPort(port + 1, resolve);
                }, 500);
            }
        });
    };

    return new Promise((resolve) => {
        return checkPort(testPort, resolve);
    });
};

export default getFreePort;
