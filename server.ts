import app from './index';

const PORT = process.env.PORT ?? 1337;

app.listen(PORT, () => {
  console.log(`🚀 Server is accessible at http://localhost:${PORT}`);
});
