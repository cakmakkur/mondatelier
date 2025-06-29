export default function Profile() {
  return (
    <div className="profile_main_div">
      <div className="banner">
        <div className="banner_img_div">
          <img src="../../public/dev_files/painting-18.jpeg" alt="" />
        </div>
        <img
          className="profile_picture"
          src="../../public/dev_files/painting-31.jpeg"
          alt=""
        />
      </div>
      <div className="profile_display">
        <div className="profile_display--left">
          <h2 className="profile_name">Kürsat Cakmak</h2>
          <div className="profile_detail">
            <img
              style={{ display: "inline-block" }}
              src="../../public/pin_drop_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Austria
          </div>
          <div className="profile_detail">
            <img
              src="../../public/handshake_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Available as freelancer
          </div>
          <div className="profile_detail">
            <img
              src="../../public/captive_portal_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            www.cakmakkursat.com
          </div>
          <div className="profile_detail">
            <img
              src="../../public/school_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Offers masterclasses
          </div>
        </div>
        <div className="profile_display--right">
          <div className="display_nav">
            About Work Collections Followers Following
          </div>
          <div className="display_innercontainer"></div>
        </div>
      </div>
    </div>
  );
}
