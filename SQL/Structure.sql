--Creating the main table 
CREATE TABLE CommunityResource (
	ResourceID INT IDENTITY(1,1) PRIMARY KEY,
	ResourceName VARCHAR(50) NOT NULL,
	ResourceCategory VARCHAR(100) NOT NULL,
	County VARCHAR (50) NOT NULL,
	City VARCHAR (50) NOT NULL,
	StreetAddress VARCHAR (50) NOT NULL, 
	Website VARCHAR (50),
	PhoneNumber VARCHAR (15),
	Information VARCHAR (255),

);
--Category will be controlled on the front end
--so we don't have to mess with sql lists