import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export const ProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="content">
      <h1 className="title">Profile</h1>
      <p className="subtitle">Hello, {currentUser?.name}!</p>

      <ul className="menu-list">
        {['name', 'password', 'email'].map((item) => (
          <Link to={`/profile/change/${item}`} key={item}>
            <li className="button menu-item-box">
              <p style={{ margin: 0 }}>Change {item}</p>
              <i className="fa-sharp-duotone fa-solid fa-chevron-right"></i>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
