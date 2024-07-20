import './AdminHeader.scss';
import AdminImg from '../../../assets/img/imgAdmin.jpg';

function AdminHeader() {
  return (
    <header className='relative top-0 inset-x-0 z-[1111] flex items-center bg-white shadow-md p-4'>
      {/* Logo */}
      <div className='flex items-center'>
        <a href='#' className='flex items-end no-underline'>
          <h1 className='text-[#9c67ac] text-4xl font-bold'>Belly&</h1>
          <h1 className='text-3xl font-bold text-gray-800'>Babe</h1>
        </a>
        <span className='border-l h-6 border-gray-400 ml-4'></span>
        <span className='pl-6 text-2xl text-gray-600 font-semibold'>
          Administrator
        </span>
      </div>
      {/* End Logo */}

      {/* Hello Admin */}
      <nav className='ml-auto'>
        <ul className='flex items-center list-none'>
          <li className='relative'>
            <a href='#' className='flex items-center text-gray-800'>
              <img
                className='h-9 w-9 rounded-full'
                src={AdminImg}
                alt='Admin'
              />
              <span className='pl-3'>Hello, Admin</span>
            </a>
          </li>
        </ul>
      </nav>
      {/* End Hello Admin */}
    </header>
  );
}

export default AdminHeader;
