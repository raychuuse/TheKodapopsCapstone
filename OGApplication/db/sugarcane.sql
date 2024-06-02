-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: sugarcane
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bin`
--

USE sugarcane;


DROP TABLE IF EXISTS `bin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bin` (
  `binID` int NOT NULL AUTO_INCREMENT,
  `code` char(4) NOT NULL,
  `status` enum('EMPTY','FULL') NOT NULL,
  `sidingID` int DEFAULT NULL,
  `locoID` int DEFAULT NULL,
  `harvesterID` int DEFAULT NULL,
  `burnt` tinyint(1) NOT NULL DEFAULT '0',
  `missing` tinyint(1) NOT NULL DEFAULT '0',
  `repair` tinyint NOT NULL DEFAULT '0',
  `full` tinyint(1) NOT NULL DEFAULT '0',
  `droppedOffInRun` tinyint(1) DEFAULT NULL,
  `pickedUpInRun` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`binID`),
  UNIQUE KEY `binsID` (`binID`),
  UNIQUE KEY `bin_code_uindex` (`code`),
  KEY `bin_locomotive_locoID_fk` (`locoID`),
  KEY `bin_siding_sidingID_fk` (`sidingID`),
  CONSTRAINT `bin_locomotive_locoID_fk` FOREIGN KEY (`locoID`) REFERENCES `locomotive` (`locoID`),
  CONSTRAINT `bin_siding_sidingID_fk` FOREIGN KEY (`sidingID`) REFERENCES `siding` (`sidingID`)
) ENGINE=InnoDB AUTO_INCREMENT=739 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bin`
--

LOCK TABLES `bin` WRITE;
/*!40000 ALTER TABLE `bin` DISABLE KEYS */;
INSERT INTO `bin` VALUES (1,'0001','EMPTY',3,NULL,NULL,1,0,0,1,1,0),(2,'0002','FULL',3,NULL,NULL,1,0,0,1,1,0),(3,'0003','FULL',NULL,1,NULL,0,0,0,1,0,1),(4,'0004','FULL',3,NULL,NULL,1,0,0,1,0,0),(5,'0005','FULL',7,NULL,NULL,0,0,0,0,1,0),(6,'0006','FULL',NULL,1,NULL,0,0,0,1,0,1),(8,'0008','FULL',11,NULL,NULL,0,1,0,1,0,0),(9,'0009','FULL',3,NULL,NULL,1,0,0,1,0,0),(11,'0011','FULL',7,NULL,NULL,0,0,0,0,0,0),(12,'0012','FULL',NULL,1,NULL,0,0,0,1,0,1),(13,'0013','FULL',NULL,1,NULL,1,0,1,0,0,1),(14,'0014','FULL',NULL,NULL,NULL,0,0,0,0,0,0),(15,'0015','FULL',NULL,NULL,NULL,1,0,0,0,0,0),(16,'0016','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(17,'0017','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(18,'0018','EMPTY',NULL,NULL,NULL,0,0,1,0,0,0),(19,'0019','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(20,'0020','EMPTY',NULL,NULL,NULL,1,1,0,0,0,0),(21,'0021','EMPTY',NULL,NULL,NULL,1,0,0,1,0,0),(22,'0022','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(23,'0023','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(24,'0024','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(25,'0025','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(26,'0026','EMPTY',NULL,NULL,NULL,0,0,0,0,0,0),(27,'0127','EMPTY',7,NULL,NULL,1,0,0,1,1,0),(734,'0110','EMPTY',NULL,NULL,NULL,0,0,0,0,NULL,NULL);
/*!40000 ALTER TABLE `bin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocks` (
  `blockID` int NOT NULL AUTO_INCREMENT,
  `farmID` int NOT NULL,
  `blockName` varchar(100) NOT NULL,
  PRIMARY KEY (`blockID`,`farmID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='list of Blocks';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
INSERT INTO `blocks` VALUES (1,1,'Block 1'),(2,2,'Block 2'),(3,3,'Block 3');
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farms`
--

DROP TABLE IF EXISTS `farms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farms` (
  `farmID` int NOT NULL AUTO_INCREMENT,
  `farmName` varchar(255) NOT NULL,
  PRIMARY KEY (`farmID`,`farmName`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='list of Farms';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farms`
--

LOCK TABLES `farms` WRITE;
/*!40000 ALTER TABLE `farms` DISABLE KEYS */;
INSERT INTO `farms` VALUES (1,'Western Farm'),(2,'Tully Farm'),(3,'Bundaberg Farm');
/*!40000 ALTER TABLE `farms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `harvester`
--

DROP TABLE IF EXISTS `harvester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `harvester` (
  `harvesterID` int NOT NULL AUTO_INCREMENT,
  `harvesterName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`harvesterID`),
  UNIQUE KEY `idHarvester_UNIQUE` (`harvesterID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='List of Harvester';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `harvester`
--

LOCK TABLES `harvester` WRITE;
/*!40000 ALTER TABLE `harvester` DISABLE KEYS */;
INSERT INTO `harvester` VALUES (1,'BB Harvesting'),(2,'North Hill Harvesting'),(3,'Connor Harvesting'),(4,'Harvest Moon'),(5,'John Deere'),(6,'Bingham Agriculture'),(7,'Total Harvesting'),(8,'Marty McMills Group'),(9,'Trevors Group Ltd'),(10,'Bundaberg Group'),(11,'AgriGroup QLD'),(12,'Farm Team QLD'),(13,'FNQ Harvest Group'),(14,'Franky Harvesters'),(16,'Carins Sugar Group'),(17,'Tool Group'),(18,'Henry QLD'),(19,'Jarrod FNQ Ltd'),(20,'Growers Group'),(21,'Moss Group');
/*!40000 ALTER TABLE `harvester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locomotive`
--

DROP TABLE IF EXISTS `locomotive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locomotive` (
  `locoID` int NOT NULL AUTO_INCREMENT,
  `locoName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`locoID`),
  UNIQUE KEY `idLocomotive_UNIQUE` (`locoID`),
  UNIQUE KEY `locomotive_locoName_uindex` (`locoName`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='list of locomotive';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locomotive`
--

LOCK TABLES `locomotive` WRITE;
/*!40000 ALTER TABLE `locomotive` DISABLE KEYS */;
INSERT INTO `locomotive` VALUES (1,'Loco 1'),(2,'Loco 2'),(3,'Loco 3'),(4,'Loco 4'),(5,'Loco 5'),(6,'Loco 6'),(7,'Loco 7'),(8,'Loco 8'),(9,'Loco 9');
/*!40000 ALTER TABLE `locomotive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `run_stops`
--

DROP TABLE IF EXISTS `run_stops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `run_stops` (
  `stopID` int NOT NULL AUTO_INCREMENT,
  `runID` int NOT NULL,
  `sidingID` int NOT NULL,
  `collectQuantity` int NOT NULL DEFAULT '0',
  `dropOffQuantity` int NOT NULL DEFAULT '0',
  `dropOffComplete` tinyint(1) NOT NULL DEFAULT '0',
  `collectComplete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`stopID`),
  KEY `run_stops_siding_sidingID_fk` (`sidingID`),
  KEY `run_stops_runs_runID_fk` (`runID`),
  CONSTRAINT `run_stops_runs_runID_fk` FOREIGN KEY (`runID`) REFERENCES `runs` (`runID`),
  CONSTRAINT `run_stops_siding_sidingID_fk` FOREIGN KEY (`sidingID`) REFERENCES `siding` (`sidingID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `run_stops`
--

LOCK TABLES `run_stops` WRITE;
/*!40000 ALTER TABLE `run_stops` DISABLE KEYS */;
INSERT INTO `run_stops` VALUES (1,1,3,2,2,0,0),(2,1,7,2,3,0,0),(3,2,1,5,3,0,0),(4,2,9,1,6,0,0);
/*!40000 ALTER TABLE `run_stops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `runs`
--

DROP TABLE IF EXISTS `runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `runs` (
  `runID` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `runName` int NOT NULL,
  `locoID` int NOT NULL,
  PRIMARY KEY (`runID`),
  KEY `runs_locomotive_locoID_fk` (`locoID`),
  CONSTRAINT `runs_locomotive_locoID_fk` FOREIGN KEY (`locoID`) REFERENCES `locomotive` (`locoID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `runs`
--

LOCK TABLES `runs` WRITE;
/*!40000 ALTER TABLE `runs` DISABLE KEYS */;
INSERT INTO `runs` VALUES (1,CURDATE(),1,1);
INSERT INTO `runs` VALUES (2,DATE_ADD(CURDATE(), INTERVAL 1 DAY),1,1);
/*!40000 ALTER TABLE `runs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siding`
--

DROP TABLE IF EXISTS `siding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `siding` (
  `sidingID` int NOT NULL AUTO_INCREMENT,
  `sidingName` varchar(255) NOT NULL,
  PRIMARY KEY (`sidingID`),
  UNIQUE KEY `idSiding_UNIQUE` (`sidingID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='list of Siding';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siding`
--

LOCK TABLES `siding` WRITE;
/*!40000 ALTER TABLE `siding` DISABLE KEYS */;
INSERT INTO `siding` VALUES (1,'Mossman Line 1'),(2,'Mossman Line 2'),(3,'Mossman Line 3'),(4,'Mossman Line 4'),(7,'Mossman Line 5'),(8,'Mossman Line 6'),(9,'Mossman Line 7'),(10,'Mossman Line 8'),(11,'Mossman Line 9'),(12,'Mossman Line 10');
/*!40000 ALTER TABLE `siding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subs`
--

DROP TABLE IF EXISTS `subs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subs` (
  `subBlockID` int NOT NULL AUTO_INCREMENT,
  `blockID` int NOT NULL,
  `farmID` int NOT NULL,
  `subBlockName` varchar(100) NOT NULL,
  PRIMARY KEY (`subBlockID`,`blockID`,`farmID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='list of Sub-Blocks';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subs`
--

LOCK TABLES `subs` WRITE;
/*!40000 ALTER TABLE `subs` DISABLE KEYS */;
INSERT INTO `subs` VALUES (1,1,1,'Sub-Block 1'),(2,1,2,'Sub-Block 2'),(3,1,3,'Sub-Block 3'),(4,3,1,'Sub-Block 4'),(5,3,2,'Sub-Block 5'),(6,2,1,'Sub-Block 6'),(7,2,2,'Sub-Block 7'),(8,2,3,'Sub-Block 8');
/*!40000 ALTER TABLE `subs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactionlog`
--

DROP TABLE IF EXISTS `transactionlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactionlog` (
  `transactionID` int NOT NULL AUTO_INCREMENT,
  `transactionTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userID` int NOT NULL,
  `binID` int NOT NULL,
  `harvesterID` int DEFAULT NULL,
  `sidingID` int DEFAULT NULL,
  `locoID` int DEFAULT NULL,
  `stopID` int DEFAULT NULL,
  `type` enum('FILLED','EMPTIED','PICKED_UP','DROPPED_OFF','MISSING','REPAIR','BURNT','RESOLVED') NOT NULL,
  PRIMARY KEY (`transactionID`),
  UNIQUE KEY `transactionNumber` (`transactionID`),
  KEY `transactionlog_harvester_harvesterID_fk` (`harvesterID`),
  KEY `transactionlog_locomotive_locoID_fk` (`locoID`),
  KEY `transactionlog_bin_binID_fk` (`binID`),
  KEY `transactionlog_siding_sidingID_fk` (`sidingID`),
  KEY `transactionlog_users_userID_fk` (`userID`),
  KEY `transactionlog_run_stops_stopID_fk` (`stopID`),
  CONSTRAINT `transactionlog_bin_binID_fk` FOREIGN KEY (`binID`) REFERENCES `bin` (`binID`),
  CONSTRAINT `transactionlog_harvester_harvesterID_fk` FOREIGN KEY (`harvesterID`) REFERENCES `harvester` (`harvesterID`) ON DELETE CASCADE,
  CONSTRAINT `transactionlog_locomotive_locoID_fk` FOREIGN KEY (`locoID`) REFERENCES `locomotive` (`locoID`) ON DELETE CASCADE,
  CONSTRAINT `transactionlog_run_stops_stopID_fk` FOREIGN KEY (`stopID`) REFERENCES `run_stops` (`stopID`) ON DELETE CASCADE,
  CONSTRAINT `transactionlog_siding_sidingID_fk` FOREIGN KEY (`sidingID`) REFERENCES `siding` (`sidingID`) ON DELETE CASCADE,
  CONSTRAINT `transactionlog_users_userID_fk` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1013 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactionlog`
--

LOCK TABLES `transactionlog` WRITE;
/*!40000 ALTER TABLE `transactionlog` DISABLE KEYS */;
INSERT INTO `transactionlog` VALUES (956,'2024-05-21 21:58:02',9,5,NULL,7,1,2,'DROPPED_OFF'),(958,'2024-05-21 21:58:02',9,1,NULL,3,1,1,'DROPPED_OFF'),(959,'2024-05-21 21:58:02',9,2,NULL,3,1,1,'DROPPED_OFF'),(961,'2024-05-21 21:58:02',9,3,NULL,3,1,1,'PICKED_UP'),(962,'2024-05-21 22:14:55',9,13,NULL,7,1,2,'PICKED_UP'),(964,'2024-05-21 22:14:55',9,6,NULL,7,1,2,'PICKED_UP'),(965,'2024-05-21 22:14:55',9,12,NULL,7,1,2,'PICKED_UP'),(978,'2024-05-21 23:14:55',1,12,NULL,NULL,NULL,NULL,'BURNT'),(980,'2024-05-21 23:17:03',1,8,1,7,NULL,NULL,'FILLED'),(982,'2024-05-21 23:38:27',1,4,1,3,NULL,NULL,'EMPTIED'),(983,'2024-05-21 23:38:27',1,9,1,3,NULL,NULL,'EMPTIED'),(984,'2024-05-21 23:38:27',1,2,1,3,NULL,NULL,'EMPTIED'),(986,'2024-05-21 23:38:27',1,1,NULL,NULL,NULL,NULL,'BURNT'),(987,'2024-05-21 23:39:56',1,1,1,3,NULL,NULL,'EMPTIED'),(989,'2024-05-21 23:42:13',1,2,1,3,NULL,NULL,'FILLED'),(991,'2024-05-21 23:42:13',1,1,NULL,NULL,NULL,NULL,'BURNT'),(992,'2024-05-21 23:42:13',1,2,NULL,NULL,NULL,NULL,'BURNT'),(994,'2024-05-21 23:47:12',1,9,1,3,NULL,NULL,'EMPTIED'),(997,'2024-05-22 00:20:05',1,9,NULL,NULL,NULL,NULL,'BURNT'),(1000,'2024-05-22 00:31:45',1,1,1,3,NULL,NULL,'FILLED'),(1001,'2024-05-22 00:33:16',1,4,1,3,NULL,NULL,'FILLED'),(1002,'2024-05-22 00:33:16',1,9,NULL,NULL,NULL,NULL,'BURNT'),(1003,'2024-05-22 00:36:48',1,9,1,3,NULL,NULL,'FILLED'),(1004,'2024-05-22 00:36:48',1,2,NULL,NULL,NULL,NULL,'REPAIR'),(1005,'2024-05-22 00:37:10',1,2,1,3,NULL,NULL,'FILLED'),(1006,'2024-05-22 00:37:10',1,4,1,3,NULL,NULL,'FILLED'),(1007,'2024-05-22 13:31:12',1,1,NULL,NULL,NULL,NULL,'REPAIR'),(1008,'2024-05-22 13:31:18',1,1,NULL,NULL,NULL,NULL,'REPAIR'),(1009,'2024-05-22 18:25:02',1,4,NULL,NULL,NULL,NULL,'RESOLVED'),(1010,'2024-05-22 18:25:18',1,15,NULL,NULL,NULL,NULL,'RESOLVED'),(1011,'2024-05-22 18:25:38',1,13,NULL,NULL,NULL,NULL,'RESOLVED'),(1012,'2024-05-22 18:25:39',1,12,NULL,NULL,NULL,NULL,'RESOLVED');
/*!40000 ALTER TABLE `transactionlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userTokens`
--

DROP TABLE IF EXISTS `usertokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usertokens` (
  `email` varchar(255) NOT NULL,
  `userRole` varchar(255) NOT NULL,
  `resetToken` varchar(255) NOT NULL,
  PRIMARY KEY (`email`, `userRole`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for user reset tokens';
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `userRole` enum('Mill','Harvester','Locomotive') DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `harvesterID` int DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `idUsers_UNIQUE` (`userID`),
  UNIQUE KEY `email` (`email`),
  KEY `users_harvester_harvesterID_fk` (`harvesterID`),
  CONSTRAINT `users_harvester_harvesterID_fk` FOREIGN KEY (`harvesterID`) REFERENCES `harvester` (`harvesterID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for users of the program';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'$2a$08$wkJZiX0D.FPOVbsCuDmiBe14L6UFWAKkaYfALcHlv9saXPztybcvm','mill@email.com','James','Smith','Mill',1,NULL),(2,'$2a$08$HgTEhro2.iteq26ORrQ6fekeD56OsqAbjYHPUj37TgHDHcX1vkLta','example2@gmail.com','Matthew','Satler','Locomotive',1,NULL),(3,'$2a$08$vuM7du751UzTRsJYY3ri2uH2LqdhCx24dG4s3dsD4mtB/tfXOjnwa','example3@gmail.com','Brad','Young','Harvester',1,NULL),(4,'$2a$08$GlE34snn/vPoBkNdcdAmeuAeNknc0BjJwiPalD6hODA.LcI.bxpXC','example4@gmail.com','Jarrod','Stout','Harvester',1,6),(5,'root','example5@gmail.com','Anthony','Pitt','Harvester',1,9),(6,'root','example6@gmail.com','Harry','Brown','Locomotive',1,NULL),(7,'root','example7@gmail.com','Jack','Smith','Locomotive',0,NULL),(8,'root','example8@gmail.com','Ron','Falcon','Locomotive',0,NULL),(9,'$2a$08$tHBAB7gxIY82RA0NUQ.WW.6JnDvU9JtY.afrchogUHVaHoucLAhNq','example9@gmail.com','James','Gill','Harvester',0,NULL),(10,'$2a$08$G/yln3BQYKKG0NrNZHbsVuXuQSRPON3fD2Jtc8oskM37sCivKm0Dy','example17@gmail.com','Trent','Lazerick','Locomotive',1,NULL),(11,'$2a$08$GlE34snn/vPoBkNdcdAmeuAeNknc0BjJwiPalD6hODA.LcI.bxpXC','example18@gmail.com','Thomas','Meek','Harvester',1,1),(12,'$2a$08$KgvtBPBDCiSAlrPIcBijMeeFLQH0lagvTLKyZSPnUh4VyuCv8Lp/a','example12@gmail.coma','Flynn','Harris','Mill',1,NULL), (13,'$2a$08$GlE34snn/vPoBkNdcdAmeuAeNknc0BjJwiPalD6hODA.LcI.bxpXC','harvester@email.com','Jack','Smith','Harvester',1,5),(14,'$2a$08$GlE34snn/vPoBkNdcdAmeuAeNknc0BjJwiPalD6hODA.LcI.bxpXC','loco@email.com','John','Smith','Locomotive',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 18:27:09a
