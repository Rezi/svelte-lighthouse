function onmessage(e) {
  postMessage('Please write two numbers');
}

export async function get(req, res, next) {
  res.setHeader('Content-Type', 'text/javascript');
  res.end('self.onmessage = ' + onmessage.toString());
}
