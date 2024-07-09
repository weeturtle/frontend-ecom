import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import "./App.css";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  varients: {
    name: string;
  }[];
}

const client = new ApolloClient({
  uri: "http://docker.internal.host:4000/",
  cache: new InMemoryCache(),
});

function App() {
  const [data, useData] = useState<Product[] | null>();

  const useFetchData = async () => {
    const fetchedData = await client.query({
      query: gql`
        query Products {
          products {
            id
            name
            varients {
              name
            }
          }
        }
      `,
    });
    useData(fetchedData.data.products);
  };

  return (
    <div>
      <h1>Product</h1>
      {data && (
        <ul>
          {data.map((product) => (
            <li key={product.id}>
              {product.name}
              <ul>
                {product.varients.map((varient) => (
                  <li key={varient.name}>{varient.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <button onClick={useFetchData}>Fetch Data</button>
    </div>
  );
}

export default App;
