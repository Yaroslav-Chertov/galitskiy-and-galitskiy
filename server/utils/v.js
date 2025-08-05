let vValue;
const v = () => {
    if (!vValue) {
        vValue = new Date().valueOf();
    }

    return vValue;
};



export default v();