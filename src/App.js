import React, { Component } from "react";
// import React, { useEffect, useState } from "react"; // imports for the hooks solution

import "./App.css";
import { ProductItem } from "./ProductItem";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

// Solution with hooks
// -------------------
// function App() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [branches, setBranches] = useState([]);
//   const [filteredBranches, setFiteredBranches] = useState([]);

//   const loadData = async () => {
//     setIsLoading(true);
//     Promise.all([
//       fetch(`/api/branch1.json`),
//       fetch(`/api/branch2.json`),
//       fetch(`/api/branch3.json`),
//     ])
//       .then((data) => {
//         data.forEach(async (branch) => {
//           const { products } = await branch.json();
//           setBranches((branches) =>
//             formatBranchData(branches.concat([...products]))
//           );
//           setFiteredBranches((branches) =>
//             formatBranchData(branches.concat([...products]))
//           );
//         });
//       })
//       .catch((err) => console.error(err))
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   useEffect(() => {
//     loadData();
//     return () => {};
//   }, []);

//   const sortAlphabetically = (a, b) => {
//     if (a.name < b.name) return -1;
//     else if (a.name > b.name) return 1;
//     else return 0;
//   };

//   const getTotal = () => {
//     return filteredBranches.reduce((acc, curr) => {
//       acc += parseFloat(curr.sold * curr.unitPrice);
//       return acc;
//     }, 0.0);
//   };

//   const handleSearchChange = (event) => {
//     setSearch(event.target.value);
//     setFiteredBranches(filterBranches(branches, event.target.value));
//     getTotal(filteredBranches);
//   };

//   const filterBranches = (branches, search) => {
//     return branches.filter((product) => {
//       return !!search
//         ? product.name.toLowerCase().includes(search.toLowerCase())
//         : true;
//     });
//   };

//   const formatBranchData = (branches) => {
//     let branchesMap = branches.reduce((acc, curr) => {
//       if (!acc.hasOwnProperty(curr.id)) {
//         acc[curr.id] = Object.assign({}, curr);
//       } else {
//         acc[curr.id]["sold"] += curr.sold;
//       }
//       return acc;
//     }, {});
//     return Object.values(branchesMap).sort(sortAlphabetically);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="product-list">
//       <label>Search Products</label>
//       <input type="text" value={search} onChange={handleSearchChange} />

//       <table>
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Revenue</th>
//           </tr>
//         </thead>
//         <tbody>
//           <ProductItem
//             productData={filteredBranches}
//             formatNumber={formatNumber}
//           ></ProductItem>
//         </tbody>
//         <tfoot>
//           <tr>
//             <td>Total</td>
//             <td>{formatNumber(getTotal(filteredBranches))}</td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

class App extends Component {
  state = {
    isLoading: true,
    search: "",
    branches: [],
    filteredBranches: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([
      fetch(`/api/branch1.json`),
      fetch(`/api/branch2.json`),
      fetch(`/api/branch3.json`),
    ])
      .then((data) => {
        data.forEach(async (branch) => {
          const { products } = await branch.json();
          this.setState(({ branches }) => {
            return {
              branches: this.formatBranchData(
                branches.concat([...products]),
                ""
              ),
              filteredBranches: this.formatBranchData(
                branches.concat([...products])
              ),
            };
          });
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  sortAlphabetically = (a, b) => {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    else return 0;
  };

  getTotal = (filteredBranches) => {
    return filteredBranches.reduce((acc, curr) => {
      acc += parseFloat(curr.sold * curr.unitPrice);
      return acc;
    }, 0.0);
  };

  handleSearchChange = (event) => {
    event.persist();
    this.setState(({ branches }) => {
      return {
        search: event.target.value,
        filteredBranches: this.filterBranches(branches, event.target.value),
      };
    });
    this.getTotal(this.state.filteredBranches);
  };

  filterBranches = (branches, search) => {
    return branches.filter((product) => {
      return !!search
        ? product.name.toLowerCase().includes(search.toLowerCase())
        : true;
    });
  };

  formatBranchData = (branches) => {
    let branchesMap = branches.reduce((acc, curr) => {
      if (!acc.hasOwnProperty(curr.id)) {
        acc[curr.id] = Object.assign({}, curr);
      } else {
        acc[curr.id]["sold"] += curr.sold;
      }
      return acc;
    }, {});
    return Object.values(branchesMap).sort(this.sortAlphabetically);
  };

  render() {
    const {
      formatBranchData,
      getTotal,
      handleSearchChange,
      state: { search, isLoading, filteredBranches },
    } = this;

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div className="product-list">
        <label>Search Products</label>
        <input type="text" value={search} onChange={handleSearchChange} />

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <ProductItem
              productData={filteredBranches}
              formatNumber={formatNumber}
            ></ProductItem>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{formatNumber(getTotal(filteredBranches))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default App;
