import CustomNumberFormat from "../../../utils/CustomNumberFormat";

export default function ProfileReport({ year, percents, results }) {
  return (
    <div className='col-6 col-md-12 col-lg-4 order-4 order-md-2'>
      <div className='row'>
        <div className='col-12 mb-4'>
          <div className='card'>
            <div className='card-body'>
              <div className='d-flex justify-content-between flex-sm-row flex-column gap-3'>
                <div className='d-flex flex-sm-column flex-row align-items-start justify-content-between'>
                  <div className='card-title'>
                    <h5 className='text-nowrap mb-2'>Profile Report</h5>
                    <span className='badge bg-label-warning rounded-pill'>
                      Year {year}
                    </span>
                  </div>
                  <div className='mt-sm-auto'>
                    <small className='text-success text-nowrap fw-semibold'>
                      <i className='bx bx-chevron-up' /> {percents}%
                    </small>
                    <h3 className='mb-0'>
                      <CustomNumberFormat numStr={results} />
                    </h3>
                  </div>
                </div>
                <div id='profileReportChart' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
