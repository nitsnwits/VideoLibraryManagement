SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `VideoLibraryManagementDB` ;
CREATE SCHEMA IF NOT EXISTS `VideoLibraryManagementDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `VideoLibraryManagementDB` ;

-- -----------------------------------------------------
-- Table `VideoLibraryManagementDB`.`members`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `VideoLibraryManagementDB`.`members` ;

CREATE TABLE IF NOT EXISTS `VideoLibraryManagementDB`.`members` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `membershipId` VARCHAR(11) NOT NULL DEFAULT '000-00-0000',
  `email` VARCHAR(45) NOT NULL,
  `fName` VARCHAR(45) NULL DEFAULT 'Default First',
  `lName` VARCHAR(45) NULL DEFAULT 'Default Last',
  `password` VARCHAR(45) NULL,
  `address1` VARCHAR(100) NULL,
  `address2` VARCHAR(100) NULL,
  `city` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `zip` VARCHAR(10) NULL,
  `adminFlag` INT NULL DEFAULT 0,
  `last_login` TIMESTAMP NULL DEFAULT NOW(),
  `subscriptionFee` DECIMAL(12,2) NULL DEFAULT 0.00,
  `balance` DECIMAL(12,2) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  FULLTEXT INDEX `ft_membershipId` (`membershipId` ASC),
  FULLTEXT INDEX `ft_email` (`email` ASC),
  FULLTEXT INDEX `ft_fName` (`fName` ASC),
  FULLTEXT INDEX `ft_lName` (`lName` ASC),
  FULLTEXT INDEX `ft_addr1` (`address1` ASC),
  FULLTEXT INDEX `ft_addr2` (`address2` ASC),
  FULLTEXT INDEX `ft_city` (`city` ASC),
  FULLTEXT INDEX `ft_state` (`state` ASC),
  FULLTEXT INDEX `ft_zip` (`zip` ASC),
  FULLTEXT INDEX `ft_all` (`membershipId` ASC, `email` ASC, `fName` ASC, `lName` ASC, `address1` ASC, `address2` ASC, `city` ASC, `state` ASC, `zip` ASC),
  INDEX `I_adminFlag` USING BTREE (`adminFlag` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `VideoLibraryManagementDB`.`movies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `VideoLibraryManagementDB`.`movies` ;

CREATE TABLE IF NOT EXISTS `VideoLibraryManagementDB`.`movies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `banner` VARCHAR(200) NULL,
  `category` VARCHAR(45) NULL,
  `releaseDate` INT NULL,
  `rentAmount` DECIMAL(12,2) NULL DEFAULT 0.00,
  `availableCopies` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `I_movie_name` (`name` ASC),
  INDEX `I_rent_amount` (`rentAmount` ASC),
  INDEX `I_movie_category` (`category` ASC),
  FULLTEXT INDEX `ft_name` (`name` ASC),
  FULLTEXT INDEX `ft_banner` (`banner` ASC),
  FULLTEXT INDEX `ft_category` (`category` ASC),
  FULLTEXT INDEX `ft_all` (`name` ASC, `banner` ASC, `category` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `VideoLibraryManagementDB`.`orders`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `VideoLibraryManagementDB`.`orders` ;

CREATE TABLE IF NOT EXISTS `VideoLibraryManagementDB`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `memberId` INT NULL,
  `movieId` INT NULL,
  `issueDate` DATE NULL,
  `submitDate` DATE NULL,
  `numOfCopies` INT NULL DEFAULT 0,
  `isSubmitted` INT NULL DEFAULT 0,
  `movieAmount` DECIMAL(12,2) NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  INDEX `fk_orders_memberId_idx` (`memberId` ASC),
  INDEX `fk_orders_movieId_idx` (`movieId` ASC),
  INDEX `I_orders_isSubmitted` USING BTREE (`isSubmitted` ASC),
  CONSTRAINT `fk_orders_memberId`
    FOREIGN KEY (`memberId`)
    REFERENCES `VideoLibraryManagementDB`.`members` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_orders_movieId`
    FOREIGN KEY (`movieId`)
    REFERENCES `VideoLibraryManagementDB`.`movies` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
