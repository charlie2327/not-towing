
export const ApiService = {
  get: async (endpoint, attr = {}) => {
    const init = {
      ...attr,
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    };
    console.log(init, "init");
    return fetch(endpoint, init);
  },
    post: async (endpoint, data, attr = {}) => {
        const init = {
        ...attr,
        method: "POST",
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        };
        return fetch(endpoint, init);
    },
};
