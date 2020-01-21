/*
 Navicat Premium Data Transfer

 Source Server         : clq
 Source Server Type    : MySQL
 Source Server Version : 50728
 Source Host           : localhost:3306
 Source Schema         : qz

 Target Server Type    : MySQL
 Target Server Version : 50728
 File Encoding         : 65001

 Date: 21/01/2020 17:44:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `unionid` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `openId` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nickname` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rule` int(2) DEFAULT NULL,
  PRIMARY KEY (`unionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('onmaV07KFbndEt5JwBXCuIlc-cvo', 'o3yoo42AkF6cJkr1V_gi1mSIXA-s', NULL, NULL, NULL);
INSERT INTO `user` VALUES ('onmaV0zqVcbRWLuWPylTFqpgbYk8', 'o3yoo43mZhwcmPfpMlIcrJTPJtZg', NULL, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
