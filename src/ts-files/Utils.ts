// @ts-nocheck

const customArrayProperty = (originArray: Array<any>) => {
  let offset: number = 0;
  Object.defineProperty(Array.prototype, "asyncForEach", {
    enumerable: false,
    configurable: true,
    value: function (task) {
      return new Promise((resolve, reject) => {
        this.forEach(function (item, index, array) {
          task(item, index, array);
          setTimeout(() => {
            if (Object.is(index, originArray.length - 1)) {
              resolve({ status: "finished", count: array.length });
            }
          }, 1000 + offset);
          offset += 1000;
        });
      });
    },
  });
};

export { customArrayProperty };
