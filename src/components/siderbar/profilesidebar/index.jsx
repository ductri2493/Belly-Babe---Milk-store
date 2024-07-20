import React from 'react';
import avatar from "../../../assets/img/avatar.png";
import line from "../../../assets/img/c-line.png";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileSidebar = () => {
    const points = useSelector((state) => state.points.points);
    const userInfo = useSelector((state) => state.user.userInfo);

    return (
        <div className="leading-tight mx-auto box-block py-3 h-[50vh] m-4 shadow-md">
            <div className="mx-auto w-full flex text-center px-2.5 mb-2.5">
                <div className="mb-2.5 cursor-pointer rounded-full mr-2 bg-cover bg-no-repeat text-[30px] leading-[50px] w-[50px] h-[50px]">
                    <img className="w-[50px] h-[50px]" src={avatar} />
                </div>
                <div className="text-left">
                    <div className="block font-concung text-sm text-gray-600 mb-2.5">
                        {userInfo.name || 'Bố, Mẹ'}
                    </div>
                    <Link
                        to="/userinfo"
                        className="bg-gray-200 px-1 py-1 w-[130px] h-4 rounded-lg text-[#5078A0] text-[10px] font-medium"
                        title="Khách hàng"
                    >
                        Thông tin tài khoản
                    </Link>
                </div>
            </div>
            <img height="6" src={line} />
            <div className="mx-auto w-full text-center px-3.75">
                <div className="flex items-center pt-2">
                    <img
                        src="https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/diamond.png"
                        className="h-6"
                        alt="Thẻ thành viên"
                    />
                    <div className="ml-3.75 text-left w-full flex justify-between leading-8">
                        <Link to="/">
                            <span className="ml-3 block text-gray-600 text-lg font-medium ">
                                Trang chủ
                            </span>
                        </Link>
                    </div>
                    <img src="https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/menu-item.png" />
                </div>
            </div>
            <div className="mx-auto w-full text-center px-3.75">
                <div className="flex items-center pt-2">
                    <img
                        src="https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/c-order.png"
                        className="h-6"
                        alt="Thẻ thành viên"
                    />
                    <div className="ml-3.75 text-left w-full flex justify-between leading-8">
                        <Link to="/order" title="Hạng thành viên">
                            <span className="ml-3 block text-gray-600 text-lg font-medium ">
                                Đơn hàng
                            </span>
                        </Link>
                    </div>
                    <img src="https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/menu-item.png" />
                </div>
            </div>
            <div className="mx-auto w-full text-center px-3.75">
                <div className="flex items-center pt-2">
                    <img
                        src="https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/point-member.png"
                        className="h-6"
                        alt="Thẻ thành viên"
                    />
                    <div className="ml-3.75 text-left w-full flex justify-between leading-8">
                        <span className="ml-3 block text-gray-600 text-lg font-medium ">
                            Điểm của bạn:
                        </span>
                    </div>
                    <img src="https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/menu-item.png" />
                </div>
                {points}
            </div>
        </div>
    );
};

export default ProfileSidebar;
