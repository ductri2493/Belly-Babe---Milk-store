import { useState } from "react";

const ExpenseOverview = ({ data = {} }) => {
  const {
    totalBalance = 0,
    incomePercentage = 0,
    expenseComparison = "",
    expenses = [],
  } = data;
  const [activeTab, setActiveTab] = useState("income");
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "income":
//         return (
//           <div
//             className='tab-pane fade show active'
//             id='navs-tabs-line-card-income'
//             role='tabpanel'
//           >
//             <div className='d-flex p-4 pt-3'>
//               <div className='avatar flex-shrink-0 me-3'>
//                 <img
//                   src='/admin-kit/assets/img/icons/unicons/wallet.png'
//                   alt='User'
//                 />
//               </div>
//               <div>
//                 <small className='text-muted d-block'>Total Balance</small>
//                 <div className='d-flex align-items-center'>
//                   <h6 className='mb-0 me-1'>
//                     ${incomeData.totalBalance.toFixed(2)}
//                   </h6>
//                   <small
//                     className={`fw-semibold ${
//                       incomeData.percentageChange > 0
//                         ? "text-success"
//                         : "text-danger"
//                     }`}
//                   >
//                     <i
//                       className={`bx bx-chevron-${
//                         incomeData.percentageChange > 0 ? "up" : "down"
//                       }`}
//                     />
//                     {Math.abs(incomeData.percentageChange)}%
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div id='incomeChart' />
//             <div className='d-flex justify-content-center pt-4 gap-2'>
//               <div className='flex-shrink-0'>
//                 <div id='expensesOfWeek' />
//               </div>
//               <div>
//                 <p className='mb-n1 mt-1'>Expenses This Week</p>
//                 <small className='text-muted'>
//                   ${incomeData.expensesChange} less than last week
//                 </small>
//               </div>
//             </div>
//           </div>
//         );
//       case "expenses":
//         return (
//           <div
//             className='tab-pane fade show active'
//             id='navs-tabs-line-card-expenses'
//             role='tabpanel'
//           >
//             <div className='d-flex p-4 pt-3'>
//               <div className='avatar flex-shrink-0 me-3'>
//                 <img
//                   src='/admin-kit/assets/img/icons/unicons/chart.png'
//                   alt='Expenses'
//                 />
//               </div>
//               <div>
//                 <small className='text-muted d-block'>Total Expenses</small>
//                 <div className='d-flex align-items-center'>
//                   <h6 className='mb-0 me-1'>
//                     ${expenseData.totalExpenses.toFixed(2)}
//                   </h6>
//                   <small
//                     className={`fw-semibold ${
//                       expenseData.percentageChange > 0
//                         ? "text-danger"
//                         : "text-success"
//                     }`}
//                   >
//                     <i
//                       className={`bx bx-chevron-${
//                         expenseData.percentageChange > 0 ? "up" : "down"
//                       }`}
//                     />
//                     {Math.abs(expenseData.percentageChange)}%
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div id='expensesChart' />
//             <div className='d-flex justify-content-center pt-4 gap-2'>
//               <div className='flex-shrink-0'>
//                 <div id='expensesOfMonth' />
//               </div>
//               <div>
//                 <p className='mb-n1 mt-1'>Expenses This Month</p>
//                 <small className='text-muted'>
//                   ${expenseData.expensesChange} more than last month
//                 </small>
//               </div>
//             </div>
//           </div>
//         );
//       case "profit":
//         return (
//           <div
//             className='tab-pane fade show active'
//             id='navs-tabs-line-card-profit'
//             role='tabpanel'
//           >
//             <div className='d-flex p-4 pt-3'>
//               <div className='avatar flex-shrink-0 me-3'>
//                 <img
//                   src='/admin-kit/assets/img/icons/unicons/profit.png'
//                   alt='Profit'
//                 />
//               </div>
//               <div>
//                 <small className='text-muted d-block'>Total Profit</small>
//                 <div className='d-flex align-items-center'>
//                   <h6 className='mb-0 me-1'>
//                     ${profitData.totalProfit.toFixed(2)}
//                   </h6>
//                   <small
//                     className={`fw-semibold ${
//                       profitData.percentageChange > 0
//                         ? "text-success"
//                         : "text-danger"
//                     }`}
//                   >
//                     <i
//                       className={`bx bx-chevron-${
//                         profitData.percentageChange > 0 ? "up" : "down"
//                       }`}
//                     />
//                     {Math.abs(profitData.percentageChange)}%
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div id='profitChart' />
//             <div className='d-flex justify-content-center pt-4 gap-2'>
//               <div className='flex-shrink-0'>
//                 <div id='profitOfQuarter' />
//               </div>
//               <div>
//                 <p className='mb-n1 mt-1'>Profit This Quarter</p>
//                 <small className='text-muted'>
//                   ${profitData.profitChange} more than last quarter
//                 </small>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

  return (
    <div className='col-md-6 col-lg-4 order-1 mb-4'>
      <div className='card h-100'>
        <div className='card-header'>
          <ul className='nav nav-pills' role='tablist'>
            <li className='nav-item'>
              <button
                type='button'
                className={`nav-link ${activeTab === "income" ? "active" : ""}`}
                role='tab'
                onClick={() => setActiveTab("income")}
              >
                Income
              </button>
            </li>
            <li className='nav-item'>
              <button
                type='button'
                className={`nav-link ${
                  activeTab === "expenses" ? "active" : ""
                }`}
                role='tab'
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </button>
            </li>
            <li className='nav-item'>
              <button
                type='button'
                className={`nav-link ${activeTab === "profit" ? "active" : ""}`}
                role='tab'
                onClick={() => setActiveTab("profit")}
              >
                Profit
              </button>
            </li>
          </ul>
        </div>
        <div className='card-body px-0'>
          <div className='tab-content p-0'>
            <div
              className='tab-pane fade show active'
              id='navs-tabs-line-card-income'
              role='tabpanel'
            >
              <div className='d-flex p-4 pt-3'>
                <div className='avatar flex-shrink-0 me-3'>
                  <img
                    src='/admin-kit/assets/img/icons/unicons/wallet.png'
                    alt='User'
                  />
                </div>
                <div>
                  <small className='text-muted d-block'>Total Balance</small>
                  <div className='d-flex align-items-center'>
                    <h6 className='mb-0 me-1'>${totalBalance}</h6>
                    <small className='text-success fw-semibold'>
                      <i className='bx bx-chevron-up' />
                      {incomePercentage}%
                    </small>
                  </div>
                </div>
              </div>
              <div id='incomeChart' />
              <div className='d-flex justify-content-center pt-4 gap-2'>
                <div className='flex-shrink-0'>
                  <div id='expensesOfWeek' />
                </div>
                <div>
                  <p className='mb-n1 mt-1'>Expenses This Week</p>
                  <small className='text-muted'>{expenseComparison}</small>
                </div>
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='navs-tabs-line-card-expenses'
              role='tabpanel'
            >
              <div className='card-body'>
                <h5 className='card-title text-primary'>Expense Overview</h5>
                <p className='mb-4'>
                  A detailed view of all expenses incurred over the last month.
                </p>
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col'>Date</th>
                      <th scope='col'>Description</th>
                      <th scope='col'>Category</th>
                      <th scope='col'>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => (
                      <tr key={index}>
                        <td>{expense.date}</td>
                        <td>{expense.description}</td>
                        <td>{expense.category}</td>
                        <td>${expense.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
