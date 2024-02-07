// ----------------------------------------------------------------------
// ➜ Looping with Async, Await, Promise
// ----------------------------------------------------------------------
// const API_ENDPOINT = "http://datamall2.mytransport.sg/ltaodataservice";
// const PAGE_SIZE = 500; // How many records the API returns in a page.
// const LTA_API_KEY = process.env.LTA_API_KEY;
export default function usePagination() {
  return null
}
// router.get("/ltaodataservice/all/:transportation", async (req, res) => {
// 	let params=req.params;
// 	let transportation=params["transportation"];

// 	function resolveAsyncCall(reqOptions) {
// 		return new Promise(resolve => {
// 			request(reqOptions, ((err, res, body) => {
// 				let result=body.value;
// 				resolve(result);
// 			});
// 		});
// 	}
// 	async function asyncCall(transportation) {
// 		var arr_result=[];
// 		var offset = 0;

// 		var options={
// 			url: `${API_ENDPOINT}/${transportation}?$skip=${offset}`,
// 			method: "GET",
// 			json: true,
// 			headers: {
// 				"AccountKey" : LTA_API_KEY,
// 				"accept" : "application/json"
// 			}
// 		};

// 		var result = [];
// 		var toContinue=true;

// 		while(toContinue) {
// 			if(offset==0 || result.length==PAGE_SIZE) {
// 				result = await resolveAsyncCall(options);
// 				offset += PAGE_SIZE;
// 				options.url=`${API_ENDPOINT}/${transportation}?$skip=${offset}`;
// 			} else if(result.length < PAGE_SIZE) {
// 				toContinue=false;
// 			}
// 			arr_result=arr_result.concat(result);
// 		}
// 		return new Promise(resolve => {
// 			resolve(arr_result);
// 		});
// 	};

// 	try {
// 		let entireListing=await asyncCall(transportation);
// 		return res.status(200).json(entireListing);
// 	} catch(err) {
// 		return res.status(500).json({
// 			type: "error",
// 			message: (err !== null && typeof err.message !== "undefined") ? err.message : `Error. Unable to retrieve data from datamall.lta.gov.sg ${transportation} Routing API.`
// 		});
// 	}
// });

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'

// const PAGE_SIZE = 10

// function Pagination() {
//   const [data, setData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalItems, setTotalItems] = useState(0)

//   useEffect(() => {
//     fetchData()
//   }, [currentPage])

//   async function fetchData() {
//     const response = await axios.get(`your-api-url?start=${(currentPage - 1) * PAGE_SIZE}&size=${PAGE_SIZE}`)
//     setData(response.data.results)
//     setTotalItems(response.data.totalItems)
//   }

//   function handlePageClick(pageNumber) {
//     setCurrentPage(pageNumber)
//   }

//   const totalPages = Math.ceil(totalItems / PAGE_SIZE)

//   return (
//     <div>
//       {data.map((item) => (
//         <div key={item.id}>{/* Render item details */}</div>
//       ))}
//       {Array.from({ length: totalPages }, (_, i) => (
//         <button key={i} onClick={() => handlePageClick(i + 1)}>
//           {i + 1}
//         </button>
//       ))}
//     </div>
//   )
// }

// export default Pagination
