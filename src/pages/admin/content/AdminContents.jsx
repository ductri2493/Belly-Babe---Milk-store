/* eslint-disable no-unused-vars */
import { useState } from 'react';
import Profit from '../components/Profit';
import Sales from '../components/Sales';
import Revenue from '../components/Revenue';
import Payment from '../components/Payment';
import ProfileReport from '../components/ProfileReport';
import OrderStatistics from '../components/OrderStatistics';
import Transaction from '../components/Transaction';
import Transactions from '../components/Transactions';
import ExpenseOverview from '../components/ExpenseOverview';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Col, Row } from 'antd';

const AdminContents = ({ user }) => {
  // console.log(user);
  const [selectedYears, setSelectedYears] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [sales, setSales] = useState({});

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  const handleSelectYear = (year) => {
    setSelectedYears(year);
    setIsOpen(false);
  };

  const years = ['2024', '2023', '2022'];

  return (
    <>
      <div className='container'>
        {/* Row 1 */}
        <Row gutter={[16, 24]}>
          <Col span={12} className=''>
            <Sales amount={1000000} change={100} />
          </Col>
          <Col span={12} className=''>
            <Revenue
              handleSelectYear={handleSelectYear}
              handleToggleDropdown={handleToggleDropdown}
              isOpen={isOpen}
              selectedYears={selectedYears}
              years={years}
            />
          </Col>
        </Row>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <OrderStatistics />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminContents;
