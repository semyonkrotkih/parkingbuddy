/*select * from (select COUNT(*) cnt,FieldIdparkingzoneparkingzone from rawdata group by FieldId) sel where sel.cnt > 1*/



/*insert INTO parkingzone (LocationId,RegularPlaces,Pkey)
select GeoLocation,StreetName,Straekning,PKeyId 
from rawdata
where rawdata.FieldId like 'taelling_p_pladser%';*/

/*select * from location*/


/*select * from rawdata where LegalParking12 != LegalParking17 or LegalParking17 != LegalParking22 or LegalParking12 != LegalParking22*/
/*
select * from _raw2;
select COUNT(*) cnt, bydel from _raw2 group by bydel;
*/
/*select * from street where statusId = 5*/


/*insert INTO street (Name,Code,ZipCode,City,CityPart,StatusId)
select r.vejnavn,r.vejkode,case when r.bydel='Amager Vest' then '2300' 
										when r.bydel='Amager Øst' then '2300' 
										when r.bydel='Bispebjerg' then '2400' 
										when r.bydel='Brønshøj-Husum' then '2700'
										when r.bydel='Indre By' then ''
										when r.bydel='Nørrebro' then '2200'
										when r.bydel='Valby' then '2500'
										when r.bydel='Vanløse' then '2720'
										when r.bydel='Vesterbro-Kongens Enghave' then ''
										when r.bydel='Østerbro' then '2100' END,
										'København',r.bydel,5
from _raw2 r
where r.vejstatus = ''
group by r.vejnavn,r.vejkode,r.bydel*/


/*delete from parking_lot;*/

/*
update parking_lot_copy set Lon = 
((cast(SUBSTRING(wkbgeometry, 19, LOCATE(' ',wkbgeometry, 19) - 19) as DECIMAL(22, 18)) + 
CAST(SUBSTRING(SUBSTRING_INDEX(wkbgeometry, ',', -1), LOCATE(' ',SUBSTRING_INDEX(wkbgeometry, ',', -1))) as DECIMAL(22, 18))) / 2),


Lat = ((CAST(SUBSTRING(wkbgeometry, LOCATE(' ',wkbgeometry, 18), LOCATE(',',wkbgeometry)-LOCATE(' ',wkbgeometry, 18)) as DECIMAL(22, 18)) +
CAST(SUBSTRING(SUBSTRING_INDEX(wkbgeometry, ' ', -1), 1, LENGTH(SUBSTRING_INDEX(wkbgeometry, ' ', -1)) - 2) as DECIMAL(22, 18))) / 2)
*/
/*
SET @nordWestLat=12.514082630400607;
SET @nordWestLan=55.69293333869906;
SET @southEastLat=12.515293830400607;
SET @southEastLan=55.69193333869906;
select pl.Id,pl.WkbGeometry,pl.Lat,pl.Lan,pl.PlaceNumber,pl.Notes,pz.Text as ParkingZoneName, pz.Price, pl.ParkingRegulationId,pl.ParkingStandardId,s.Name as StreetName,s.City,s.CityPart,pl.StreetDirectionId as StreetDirection,s.OwnershipId as StreetOwnership
from parking_lot pl
inner join street s on s.Id = pl.StreetId
left join parking_zone pz on pz.Id = pl.ParkingZoneId
where pl.Lat >= @nordWestLat and pl.Lat <= @southEastLat and pl.Lan <= @nordWestLan and pl.Lan >= @southEastLan

*/

select * from parking_lot where PKey = 12674