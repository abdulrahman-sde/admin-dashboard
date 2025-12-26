import { Link } from "react-router";
import { Button } from "./components/ui/button";
import { useGetProductsQuery } from "./lib/store/services/products/productsApi";

export default function App() {
  const { data } = useGetProductsQuery({ page: 1 });
  console.log(data);
  return (
    <>
      <Link to="/login">
        <Button>Go to Login</Button>
      </Link>
      <br />
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </>
  );
}
