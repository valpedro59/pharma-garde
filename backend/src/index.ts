import app from "./app";
import { env } from "./config/env";
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on 3000`);
});
