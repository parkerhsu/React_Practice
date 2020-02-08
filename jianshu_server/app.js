const queryString = require("querystring");

const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// 处理 postData
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers["content-type"] !== 'application/json') {
            resolve({});
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        });
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        });
    })
    return promise;
}

const serverHandler = (req, res) => {
    res.setHeader('Content-type', "application/json");

    const url = req.url;
    req.path = url.split("?")[0];

    req.query = queryString.parse(url.split('?')[1]);

    getPostData(req).then(postData => {
        req.body = postData;

        /* const blogData = handleBlogRouter(req, res);
        if (blogData) {
            res.end(JSON.stringify(blogData));
            return;
        } */
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                );
            });
            return;
        }

        /* const userData = handleUserRouter(req, res);
        if (userData) {
            res.end(JSON.stringify(userData));
            return;
        } */
        const userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                );
            });
            return;
        }

        // 未命中返回404
        res.writeHead(404, {"Content-type": "text/plain"});
        res.write("404 not found\n");
        res.end();
    });
}

module.exports = serverHandler;