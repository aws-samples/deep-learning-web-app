import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { withRouter } from "react-router";

import './Header.scss';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {Colors} from "./common/Colors";

class Header extends Component {

  showLogInButton(isLoggedIn) {
    if (!isLoggedIn) {
      return (
        <NavItem>
          <NavLink href="/login/">Log in</NavLink>
        </NavItem>
      );
    } else {
      return null;
    }
  }

  shouldHaveDropdown(menu, onLogout) {
    return this.shouldShowMenu(menu) || onLogout;
  }

  shouldShowMenu(menu) {
    return Array.isArray(menu) && menu.length > 0;
  }

  showMenuItems(menu) {
    if (!this.shouldShowMenu(menu)) {
      return null;
    }

    return menu.map(item => {
      return <DropdownItem
        key={item.text}
        onClick={() => this.props.history.push(item.href)}
      >
        {item.text}
      </DropdownItem>;
    });
  }

  showUserMenu(isLoggedIn, loginName, menu, onLogout) {
    if (isLoggedIn) {
      const dropdownAttr = this.shouldHaveDropdown(menu, onLogout) ?
        {nav: true, caret: true}
        : {nav: true};
      return (
        <UncontrolledDropdown nav>

          <DropdownToggle {...dropdownAttr}>
            <span className="oi oi-person mr-2"/>
            <span className="navbar-text mr-2">{loginName}</span>
          </DropdownToggle>

          {
            this.shouldHaveDropdown(menu, onLogout) &&

            <DropdownMenu right>
              {this.showMenuItems(menu)}

              {onLogout &&
              <DropdownItem
                to="/logout"
                onClick={onLogout}>
                Log out
              </DropdownItem>
              }
            </DropdownMenu>
          }

        </UncontrolledDropdown>
      );
    } else {
      return null;
    }
  }

  createThemeObject(theme) {
    if (theme === 'dark') {
      return {
        dark: true,
        // color: 'dark',// will use dark-gray with !important style
        // Instead of customizing bootstrap (which is difficult to find right variable and avoid side effect)
        style: {
          backgroundColor: Colors.SQUIDINK
        }
      };
    } else {
      return {
        color: 'light',
        light: true
      };
    }
  }

  render() {
    const {customerName, customerLogoUrl, loginName, theme, logoHeight, menu, onLogout} = this.props;
    const hideLoginComponent = (loginName === undefined || loginName === null);
    const isLoggedIn = !!loginName;

    let customTheme = this.createThemeObject(theme);

    return (
      <Navbar {...customTheme} expand="sm" className="spd-header shadow-sm">
        <NavbarBrand href="/">
          {
            customerLogoUrl &&
            <img src={customerLogoUrl} height={logoHeight || "24"} alt='Customer logo'/>
          }
          <span className="ml-3">{customerName}</span>
        </NavbarBrand>

        {/* Divide left and right alignment*/}
        <div className="spd-header__filler"/>

        {
          !hideLoginComponent &&
          <Nav className="ml-auto" navbar>
            {this.showLogInButton(isLoggedIn)}
            {this.showUserMenu(isLoggedIn, loginName, menu, onLogout)}
          </Nav>
        }

      </Navbar>
    );
  }

}

Header.propTypes = {
  customerLogoUrl: PropTypes.string,
  customerName: PropTypes.string,
  loginName: PropTypes.string,
  menu: PropTypes.array,
  onLogout: PropTypes.func,
  theme: PropTypes.oneOf(['light', 'dark']),
  logoHeight: PropTypes.number,
};


export default withRouter(Header)
