/*
Definitions

from AAS 11-666 McCarthy and Wikipedia

BCRS 	: Barycentric Celestial Reference System "A coordinate system used in astrometry to specify the location and motions of astronomical objects. It was created in 2000 by the International Astronomical Union (IAU) to be the global standard reference system for objects located outside the gravitational vicinity of Earth. The orientation of the BCRS coordinate system coincides with that of the International Celestial Reference System (ICRS). Both are centered at the barycenter of the Solar System, and both "point" in the same direction. That is, their axes are aligned with that of the International Celestial Reference Frame (ICRF)"
CIO		: Celestial Intermediate Origin 
CIP 	: Celestial Intermediate Pole "A geocentric equatorial pole defined as being the intermediate pole in the transformation from the GCRS to the ITRS, separating nutation from polar motion."
CIRS 	: Celestial Intermediate Reference System "Geocentric reference system related to the GCRS by a time-dependent rotation taking into account precession-nutation. It is defined by the intermediate equator of the Celestial Intermediate Pole (CIP) and the Celestial Intermediate Origin (CIO) on a specific date"
EO 		: Equation of Origins " the CIO based right ascension of the equinox along the moving equator and corresponds to the accumulated precession and nutation in right ascension from the epoch of reference to the current date"
ERA		: Earth Rotation Angle "The ERA is the angle measured along the intermediate equator of the CIP between the TIO and the CIO, positively in the retrograde direction and increasing linearly for an ideal, uniformly rotating Earth. It is related to UT1 by a conventionally adopted expression in which ERA is a linear function of UT1."
GCRS 	: Geocentric Celestial Reference System "A system of geocentric space-time coordinates defined such that the transformation between BCRS and GCRS spatial coordinates contains no rotation component, so that GCRS is kinematically non-rotating with respect to BCRS. The spatial orientation of the GCRS is derived from that of the BCRS."
GST 	: Greenwich Sidereal Time "is an angle that is the sum of the ERA and the angular distance between the CIO and a conventional equinox along the moving equator. This distance is called the Equation of Origins (EO)"
GTRS 	: Geocentric Terrestrial Reference System "A system of geocentric space-time coordinates co-rotating with the Earth"
ICRF 	: International Celestial Reference Frame "A set of extragalactic objects whose adopted positions and uncertainties realize the ICRS axes. It is also the name of the radio catalog listing the directions to defining sources. Successive revisions of the ICRF are intended to minimize rotation from its original orientation."
ICRS 	: International Celestial Reference System "The idealized barycentric coordinate system to which celestial positions are referred. It is kinematically non-rotating with respect to distant extragalactic objects. It was aligned close to previous astronomical reference systems for continuity. Its orientation is independent of epoch, ecliptic or equator and is realized by a list of adopted coordinates of extragalactic sources. "
MJD 	: Modified Julian Day "Julian days since J2000 (UT1)"
ITRS 	: International Terrestrial Reference System 
UT1 	: Universal Time "A measure of the Earth’s rotation angle expressed in time units and treated conventionally as an astronomical time scale defined by the rotation of the Earth with respect to the Sun. It is expressed in time units rather than in degrees. It is now defined as linearly proportional to ERA."
UTC 	: Coordinated Universal Time "The primary time standard by which the world regulates clocks and time. The current version of UTC is defined by International Telecommunications Union Recommendation (ITU-R TF.460-6), Standard-frequency and time-signal emissions,[4] and is based on International Atomic Time (TAI) with leap seconds added at irregular intervals to compensate for the slowing of the Earth's rotation. Leap seconds are inserted as necessary to keep UTC within 0.9 second of the UT1"
TIO 	: Terrestrial Intermediate Origin
TIRS 	: Terrestrial Intermediate Reference System "A geocentric reference system defined by the intermediate equator of the CIP and the TIO. It is related to the ITRS by polar motion and the TIO locator. It is related to the CIRS by the Earth Rotation Angle (ERA) around the CIP that realizes the common z-axis of the two systems. The TIO is the origin of longitude in the ITRS. It is the non-rotating origin in the ITRS that was originally set at the ITRF origin of longitude."
TT 		: Terrestrial Time



*/







/**
 * Returns the earth rotation angle based on the Julian UT1 days after J2000. The ERA is the angle measured along the intermediate equator
 * of the CIP between the TIO and CIO, positively in the retrograde direction and increasing linearly for an ideal, uniformly rotating Earth
 *
 * @param {number} MJD, Julian day in UT1 frame 
 * @return {number} angle, the earths rotation angle on  in reference to the equinox
 */
function earth_rotation_angle(MJD) {
	return 6.283185307179586476925286766559*(0.7790572732640 + 1.00273781191135448*(MJD);
}


/**
 * 
 * 
 */
function earth_GST(UT1,TT) {
	return earth_rotation_angle(UT1) - earth_equation_of_origin(TT);
}

function JD(year,month,day,hour,min,second) {
	if(m < 3) {
		year--;
		month+=12;
	}
	let A = 2-fix(year/100)+fix(year/400);
	let tod = (sec + 60*(min + hour*60))/86400;
	return fix(365.25*year) + fix(30.6001*(month+1)) + day + A + tod + 1720994.5;
}

/**
 * 
 * 
 */
function earth_equation_of_origin(TT){
	let t = (TT - 2451545.0)/36525;
	return -7.032707258e-8 + t*(-0.02236036587103 + t*(-6.7465784654e-6 + 2.13318019688e-12*t) – ∆ψ cosεA – P;
}

/**
 * 
 * 
 */
function earth_equation_of_equinox() {
	
}

/**
 *
 * @param {number} GMT, Greenwich mean time
 *
 */
 function GMST(GMT) {
	 return 24110.54841 + GMT*(8640184.812866 + GMT*(0.093104 - 6.2e-6*GMT));
 }
 
function GMST_UT1(MJD) {
	return 4.894961212823058751375704430 + MJD*(6.300388098984893552276513720 + MJD*(5.075209994113591478053805523e-15 - 9.253097568194335640067190688e-24*MJD));
}

/**
 * 
 * 
 */
function TT2TDB(TT,MJD)) {
	let g = 6.240093127947846479671040841485‬ + ‭0.0172019703436438682931486269853‬*MJD;
	return TT + 0.001658 *sin(g) + 0.000014 *sin(2*g);
}

/**
 * 
 * @param {number} MJD , Modified Julian Day (JD - 2451545.0)
 * 
 */
function earth_accumulated_precession(MJD) {
	let t = MJD/3652500;
	return t*(5028.796195 +  1.1054348*t);
}

/**
 * 
 * 
 */
function earth_nutation_in_longitude(longitude_AN_moon) {
	return -8.338795315084087e-5*sin(longitude_AN_moon);
}

/**
 * 
 * 
 */
function earth_nutation_in_latitude(longitude_AN_moon) {
	return 4.460285866207767e-5*cos(longitude_AN_moon);
}

/**
 * 
 * 
 */
function earth_obliquity_ecliptic(MJD){
	t = MJD/3652500;
	return 0.409092804223 + t*(-0.02269378904 + t*(-7.514612057197869e-6 + t*(0.009692637519582478 + t*(-0.00024909726935408167 + t*(-0.0012104343176261884 + t*(-0.00018931974247327535 + t*(3.451873409499924e-5 + t*(0.0001351175729252288 + t*(2.8070712136242365e-5 + 1.187793518718373e-5*t)))))))));  
}


/**
 *
 * @param {number} GMT, Greenwich mean time
 *
 */
 function rotation_matrix_GCRS_to_ITRS(UTC) {
	 UT1 = UTC; // decent approximation
	 
 }



