import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const ETHAN_FEED = { posts: [{ timestamp: 1571152779, feedOrder: 0, reactionCount: '4' }, { timestamp: 1571002486, feedOrder: 1, reactionCount: '161' }, { timestamp: 1571158153, feedOrder: 2, reactionCount: '20' }, { timestamp: 1571107107, feedOrder: 3, reactionCount: '6' }, { timestamp: 1571117735, feedOrder: 4, reactionCount: '15' }, { timestamp: 1571103312, feedOrder: 5, reactionCount: '45' }, { timestamp: 1571102050, feedOrder: 6, reactionCount: '173' }, { timestamp: 1571108512, feedOrder: 7, reactionCount: '16' }, { timestamp: 1571106790, feedOrder: 8, reactionCount: '34' }, { timestamp: 1571097970, feedOrder: 9, reactionCount: '484' }, { timestamp: 1571064372, feedOrder: 10, reactionCount: '104' }, { timestamp: 1571139598, feedOrder: 11, reactionCount: '580' }, { timestamp: 1571129890, feedOrder: 12, reactionCount: '39' }, { timestamp: 1571157406, feedOrder: 13, reactionCount: '3' }, { timestamp: 1571073442, feedOrder: 14, reactionCount: '3' }, { timestamp: 1571069815, feedOrder: 15, reactionCount: '32' }, { timestamp: 1570745727, feedOrder: 16, reactionCount: '76' }, { timestamp: 1571097533, feedOrder: 17, reactionCount: '22' }, { timestamp: 1571062980, feedOrder: 18, reactionCount: '60' }, { timestamp: 1571068910, feedOrder: 19, reactionCount: '24' }, { timestamp: 1571117835, feedOrder: 20, reactionCount: '8' }, { timestamp: 1571149388, feedOrder: 21, reactionCount: '13' }, { timestamp: 1570837233, feedOrder: 22, reactionCount: '28' }, { timestamp: 1571151439, feedOrder: 23, reactionCount: '61' }, { timestamp: 1571150738, feedOrder: 24, reactionCount: '2' }, { timestamp: 1571047117, feedOrder: 25, reactionCount: '0' }, { timestamp: 1571117771, feedOrder: 26, reactionCount: '8' }, { timestamp: 1571149941, feedOrder: 27, reactionCount: '7' }, { timestamp: 1571154430, feedOrder: 28, reactionCount: '9' }, { timestamp: 1571150440, feedOrder: 29, reactionCount: '24' }, { timestamp: 1571118583, feedOrder: 30, reactionCount: '13' }, { timestamp: 1571153099, feedOrder: 31, reactionCount: '32' }, { timestamp: 1571138867, feedOrder: 32, reactionCount: '0' }, { timestamp: 1571014747, feedOrder: 33, reactionCount: '4' }, { timestamp: 1571094418, feedOrder: 34, reactionCount: '55' }, { timestamp: 1570912746, feedOrder: 35, reactionCount: '1' }, { timestamp: 1571150105, feedOrder: 36, reactionCount: '5' }, { timestamp: 1571152307, feedOrder: 37, reactionCount: '7' }, { timestamp: 1571139299, feedOrder: 38, reactionCount: '16' }, { timestamp: 1571151482, feedOrder: 39, reactionCount: '0' }, { timestamp: 1570888666, feedOrder: 40, reactionCount: '70' }, { timestamp: 1571158613, feedOrder: 41, reactionCount: '3' }, { timestamp: 1571158871, feedOrder: 42, reactionCount: '13' }, { timestamp: 1571071038, feedOrder: 43, reactionCount: '38' }, { timestamp: 1571068579, feedOrder: 44, reactionCount: '8' }, { timestamp: 1571140786, feedOrder: 45, reactionCount: '23' }, { timestamp: 1571150573, feedOrder: 46, reactionCount: '30' }, { timestamp: 1571157746, feedOrder: 47, reactionCount: '10' }, { timestamp: 1571065164, feedOrder: 48, reactionCount: '69' }, { timestamp: 1571156888, feedOrder: 49, reactionCount: '5' }, { timestamp: 1571014237, feedOrder: 50, reactionCount: '72' }, { timestamp: 1570911043, feedOrder: 51, reactionCount: '13' }, { timestamp: 1571011223, feedOrder: 52, reactionCount: '32' }, { timestamp: 1571139736, feedOrder: 53, reactionCount: '46' }, { timestamp: 1571003248, feedOrder: 54, reactionCount: '41' }, { timestamp: 1570998804, feedOrder: 55, reactionCount: '190' }, { timestamp: 1571067039, feedOrder: 56, reactionCount: '41' }, { timestamp: 1570982072, feedOrder: 57, reactionCount: '56' }, { timestamp: 1571159888, feedOrder: 58, reactionCount: '0' }, { timestamp: 1571134332, feedOrder: 59, reactionCount: '6' }, { timestamp: 1571117189, feedOrder: 60, reactionCount: '11' }, { timestamp: 1571121967, feedOrder: 61, reactionCount: '64' }, { timestamp: 1571062634, feedOrder: 62, reactionCount: '3K' }, { timestamp: 1571149196, feedOrder: 63, reactionCount: '32' }, { timestamp: 1571110027, feedOrder: 64, reactionCount: '1' }, { timestamp: 1571151140, feedOrder: 65, reactionCount: '3' }, { timestamp: 1570907542, feedOrder: 66, reactionCount: '61' }, { timestamp: 1571020745, feedOrder: 67, reactionCount: '29' }, { timestamp: 1571053997, feedOrder: 68, reactionCount: '18' }, { timestamp: 1571061335, feedOrder: 69, reactionCount: '59' }, { timestamp: 1571023359, feedOrder: 70, reactionCount: '34' }, { timestamp: 1571074084, feedOrder: 71, reactionCount: '6' }, { timestamp: 1571080716, feedOrder: 72, reactionCount: '11' }, { timestamp: 1571155548, feedOrder: 73, reactionCount: '3' }, { timestamp: 1571049444, feedOrder: 74, reactionCount: '47' }, { timestamp: 1564755325, feedOrder: 75, reactionCount: '2.2K' }, { timestamp: 1571154098, feedOrder: 76, reactionCount: '14' }, { timestamp: 1570993315, feedOrder: 77, reactionCount: '4' }, { timestamp: 1571138430, feedOrder: 78, reactionCount: '61' }, { timestamp: 1571148879, feedOrder: 79, reactionCount: '14' }, { timestamp: 1571132080, feedOrder: 80, reactionCount: '9' }, { timestamp: 1571111053, feedOrder: 81, reactionCount: '6' }, { timestamp: 1571140808, feedOrder: 82, reactionCount: '4' }, { timestamp: 1571141753, feedOrder: 83, reactionCount: '2' }, { timestamp: 1571151484, feedOrder: 84, reactionCount: '2' }, { timestamp: 1571141838, feedOrder: 85, reactionCount: '13' }, { timestamp: 1571136245, feedOrder: 86, reactionCount: '17' }, { timestamp: 1570896596, feedOrder: 87, reactionCount: '0' }, { timestamp: 1571147623, feedOrder: 88, reactionCount: '5' }, { timestamp: 1571144197, feedOrder: 89, reactionCount: '9' }, { timestamp: 1571155694, feedOrder: 90, reactionCount: '6' }, { timestamp: 1571017983, feedOrder: 91, reactionCount: '129' }, { timestamp: 1571140374, feedOrder: 92, reactionCount: '30' }, { timestamp: 1571132688, feedOrder: 93, reactionCount: '1' }, { timestamp: 1570989015, feedOrder: 94, reactionCount: '3K' }, { timestamp: 1571146041, feedOrder: 95, reactionCount: '28' }, { timestamp: 1571153777, feedOrder: 96, reactionCount: '10' }, { timestamp: 1571152655, feedOrder: 97, reactionCount: '11' }, { timestamp: 1571096251, feedOrder: 98, reactionCount: '13' }, { timestamp: 1571158864, feedOrder: 99, reactionCount: '1' }, { timestamp: 1571140450, feedOrder: 100, reactionCount: '41' }, { timestamp: 1571160063, feedOrder: 101, reactionCount: '0' }, { timestamp: 1571141304, feedOrder: 102, reactionCount: '30' }, { timestamp: 1571118137, feedOrder: 103, reactionCount: '3' }, { timestamp: 1570984090, feedOrder: 104, reactionCount: '9' }, { timestamp: 1571155962, feedOrder: 105, reactionCount: '10' }, { timestamp: 1571121255, feedOrder: 106, reactionCount: '12' }, { timestamp: 1571146515, feedOrder: 107, reactionCount: '25' }, { timestamp: 1571133917, feedOrder: 108, reactionCount: '0' }, { timestamp: 1571155836, feedOrder: 109, reactionCount: '46' }, { timestamp: 1571117411, feedOrder: 110, reactionCount: '32' }, { timestamp: 1571014300, feedOrder: 111, reactionCount: '171' }, { timestamp: 1571124115, feedOrder: 112, reactionCount: '6' }, { timestamp: 1571083526, feedOrder: 113, reactionCount: '1' }, { timestamp: 1571020494, feedOrder: 114, reactionCount: '685' }, { timestamp: 1571144343, feedOrder: 115, reactionCount: '29' }, { timestamp: 1570759200, feedOrder: 116, reactionCount: '339' }, { timestamp: 1571121313, feedOrder: 117, reactionCount: '59' }, { timestamp: 1571130417, feedOrder: 118, reactionCount: '12' }, { timestamp: 1571132020, feedOrder: 119, reactionCount: '1' }, { timestamp: 1571121839, feedOrder: 120, reactionCount: '3' }, { timestamp: 1571157253, feedOrder: 121, reactionCount: '16' }, { timestamp: 1571156043, feedOrder: 122, reactionCount: '7' }, { timestamp: 1571143843, feedOrder: 123, reactionCount: '4' }, { timestamp: 1571131985, feedOrder: 124, reactionCount: '3' }, { timestamp: 1571144010, feedOrder: 125, reactionCount: '16' }, { timestamp: 1571152781, feedOrder: 126, reactionCount: '25' }, { timestamp: 1570955831, feedOrder: 127, reactionCount: '46' }, { timestamp: 1571153313, feedOrder: 128, reactionCount: '3' }, { timestamp: 1571117794, feedOrder: 129, reactionCount: '5' }, { timestamp: 1571085312, feedOrder: 130, reactionCount: '45' }, { timestamp: 1571150810, feedOrder: 131, reactionCount: '29' }, { timestamp: 1571156825, feedOrder: 132, reactionCount: '6' }, { timestamp: 1571149312, feedOrder: 133, reactionCount: '4' }, { timestamp: 1571155462, feedOrder: 134, reactionCount: '2' }, { timestamp: 1571158472, feedOrder: 135, reactionCount: '5' }, { timestamp: 1571150734, feedOrder: 136, reactionCount: '6' }, { timestamp: 1571140141, feedOrder: 137, reactionCount: '95' }, { timestamp: 1571118466, feedOrder: 138, reactionCount: '11' }, { timestamp: 1571105243, feedOrder: 139, reactionCount: '165' }, { timestamp: 1571142196, feedOrder: 140, reactionCount: '7' }, { timestamp: 1571084098, feedOrder: 141, reactionCount: '0' }, { timestamp: 1571149158, feedOrder: 142, reactionCount: '17' }, { timestamp: 1571120168, feedOrder: 143, reactionCount: '23' }, { timestamp: 1570872321, feedOrder: 144, reactionCount: '35' }, { timestamp: 1571159126, feedOrder: 145, reactionCount: '0' }, { timestamp: 1571159120, feedOrder: 146, reactionCount: '5' }, { timestamp: 1571008029, feedOrder: 147, reactionCount: '10' }, { timestamp: 1571152907, feedOrder: 148, reactionCount: '19' }, { timestamp: 1571100100, feedOrder: 149, reactionCount: '547' }, { timestamp: 1571145544, feedOrder: 150, reactionCount: '23' }, { timestamp: 1571110797, feedOrder: 151, reactionCount: '8' }, { timestamp: 1571141860, feedOrder: 152, reactionCount: '2' }, { timestamp: 1571152763, feedOrder: 153, reactionCount: '2' }, { timestamp: 1570565572, feedOrder: 154, reactionCount: '351' }, { timestamp: 1571102000, feedOrder: 155, reactionCount: '28' }, { timestamp: 1571073172, feedOrder: 156, reactionCount: '17' }, { timestamp: 1571073667, feedOrder: 157, reactionCount: '4' }, { timestamp: 1571146132, feedOrder: 158, reactionCount: '8' }, { timestamp: 1571156018, feedOrder: 159, reactionCount: '2' }, { timestamp: 1570906030, feedOrder: 160, reactionCount: '24' }, { timestamp: 1571150004, feedOrder: 161, reactionCount: '26' }, { timestamp: 1571048463, feedOrder: 162, reactionCount: '320' }, { timestamp: 1571141295, feedOrder: 163, reactionCount: '4' }, { timestamp: 1571145084, feedOrder: 164, reactionCount: '3' }, { timestamp: 1571142901, feedOrder: 165, reactionCount: '1' }, { timestamp: 1571149836, feedOrder: 166, reactionCount: '12' }, { timestamp: 1571144877, feedOrder: 167, reactionCount: '4' }, { timestamp: 1571127935, feedOrder: 168, reactionCount: '28' }, { timestamp: 1571130076, feedOrder: 169, reactionCount: '65' }, { timestamp: 1571138088, feedOrder: 170, reactionCount: '21' }, { timestamp: 1571074515, feedOrder: 171, reactionCount: '4' }, { timestamp: 1570971789, feedOrder: 172, reactionCount: '40' }, { timestamp: 1570944298, feedOrder: 173, reactionCount: '145' }, { timestamp: 1571147531, feedOrder: 174, reactionCount: '8' }, { timestamp: 1571139813, feedOrder: 175, reactionCount: '58' }, { timestamp: 1571102574, feedOrder: 176, reactionCount: '12' }, { timestamp: 1571157918, feedOrder: 177, reactionCount: '0' }, { timestamp: 1571159127, feedOrder: 178, reactionCount: '5' }, { timestamp: 1571158780, feedOrder: 179, reactionCount: '13' }, { timestamp: 1571157426, feedOrder: 180, reactionCount: '5' }, { timestamp: 1570991820, feedOrder: 181, reactionCount: '16' }, { timestamp: 1571149900, feedOrder: 182, reactionCount: '362' }, { timestamp: 1571065543, feedOrder: 183, reactionCount: '2' }, { timestamp: 1571149973, feedOrder: 184, reactionCount: '5' }, { timestamp: 1571157465, feedOrder: 185, reactionCount: '152' }, { timestamp: 1570887377, feedOrder: 186, reactionCount: '165' }, { timestamp: 1571012835, feedOrder: 187, reactionCount: '171' }, { timestamp: 1567864811, feedOrder: 188, reactionCount: '57K' }, { timestamp: 1571150547, feedOrder: 189, reactionCount: '6' }, { timestamp: 1571159115, feedOrder: 190, reactionCount: '0' }, { timestamp: 1571107682, feedOrder: 191, reactionCount: '15' }, { timestamp: 1571137260, feedOrder: 192, reactionCount: '2' }, { timestamp: 1571022068, feedOrder: 193, reactionCount: '440' }, { timestamp: 1571070559, feedOrder: 194, reactionCount: '40' }, { timestamp: 1570988509, feedOrder: 195, reactionCount: '42' }, { timestamp: 1570820480, feedOrder: 196, reactionCount: '2' }, { timestamp: 1571144871, feedOrder: 197, reactionCount: '14' }, { timestamp: 1571136619, feedOrder: 198, reactionCount: '20' }, { timestamp: 1571155610, feedOrder: 199, reactionCount: '7' }, { timestamp: 1571138712, feedOrder: 200, reactionCount: '357' }, { timestamp: 1570914191, feedOrder: 201, reactionCount: '10' }, { timestamp: 1571152907, feedOrder: 202, reactionCount: '4' }, { timestamp: 1571141730, feedOrder: 203, reactionCount: '3' }, { timestamp: 1571101649, feedOrder: 204, reactionCount: '45' }, { timestamp: 1571139392, feedOrder: 205, reactionCount: '3' }, { timestamp: 1571014060, feedOrder: 206, reactionCount: '29' }, { timestamp: 1571159006, feedOrder: 207, reactionCount: '4' }, { timestamp: 1571022068, feedOrder: 208, reactionCount: '440' }, { timestamp: 1570988509, feedOrder: 209, reactionCount: '42' }, { timestamp: 1571156919, feedOrder: 210, reactionCount: '1' }, { timestamp: 1571053284, feedOrder: 211, reactionCount: '33' }, { timestamp: 1571134164, feedOrder: 212, reactionCount: '7' }, { timestamp: 1571070559, feedOrder: 213, reactionCount: '40' }, { timestamp: 1570909320, feedOrder: 214, reactionCount: '16K' }, { timestamp: 1571122763, feedOrder: 215, reactionCount: '0' }, { timestamp: 1570970860, feedOrder: 216, reactionCount: '8' }, { timestamp: 1570820480, feedOrder: 217, reactionCount: '2' }, { timestamp: 1570989563, feedOrder: 218, reactionCount: '75' }, { timestamp: 1570990763, feedOrder: 219, reactionCount: '32' }, { timestamp: 1571036081, feedOrder: 220, reactionCount: '51' }, { timestamp: 1571047162, feedOrder: 221, reactionCount: '44' }, { timestamp: 1571050602, feedOrder: 222, reactionCount: '10' }, { timestamp: 1571054532, feedOrder: 223, reactionCount: '8' }, { timestamp: 1571056752, feedOrder: 224, reactionCount: '1' }, { timestamp: 1571057191, feedOrder: 225, reactionCount: '110' }, { timestamp: 1571057261, feedOrder: 226, reactionCount: '82' }], exportSeconds: 1571160113.156 };

const DENNIS_FEED = { posts: [{ timestamp: 1570545847, feedOrder: 0, reactionCount: '1' }, { timestamp: 1569993362, feedOrder: 1, reactionCount: '124' }, { timestamp: 1570543437, feedOrder: 2, reactionCount: '1' }, { timestamp: 1570291744, feedOrder: 3, reactionCount: '105' }, { timestamp: 1570282188, feedOrder: 4, reactionCount: '24' }, { timestamp: 1570490302, feedOrder: 5, reactionCount: '11' }, { timestamp: 1570310408, feedOrder: 6, reactionCount: '13' }, { timestamp: 1570536451, feedOrder: 7, reactionCount: '5' }, { timestamp: 1570001147, feedOrder: 8, reactionCount: '3.3K' }, { timestamp: 1570154382, feedOrder: 9, reactionCount: '0' }, { timestamp: 1570492183, feedOrder: 10, reactionCount: '7' }, { timestamp: 1570538398, feedOrder: 11, reactionCount: '6' }, { timestamp: 1570491908, feedOrder: 12, reactionCount: '2' }, { timestamp: 1570325176, feedOrder: 13, reactionCount: '22' }, { timestamp: 1570462058, feedOrder: 14, reactionCount: '6' }, { timestamp: 1570207816, feedOrder: 15, reactionCount: '297' }, { timestamp: 1570473153, feedOrder: 16, reactionCount: '22' }, { timestamp: 1570503461, feedOrder: 17, reactionCount: '26' }, { timestamp: 1570494818, feedOrder: 18, reactionCount: '8' }, { timestamp: 1570491093, feedOrder: 19, reactionCount: '1' }, { timestamp: 1570478260, feedOrder: 20, reactionCount: '30' }, { timestamp: 1570292782, feedOrder: 21, reactionCount: '26' }, { timestamp: 1570237432, feedOrder: 22, reactionCount: '5' }, { timestamp: 1570539523, feedOrder: 23, reactionCount: '0' }, { timestamp: 1570510046, feedOrder: 24, reactionCount: '5' }, { timestamp: 1570032175, feedOrder: 25, reactionCount: '116' }, { timestamp: 1570493132, feedOrder: 26, reactionCount: '4' }, { timestamp: 1570516563, feedOrder: 27, reactionCount: '11' }, { timestamp: 1570541966, feedOrder: 28, reactionCount: '13' }, { timestamp: 1570486132, feedOrder: 29, reactionCount: '3' }, { timestamp: 1568977451, feedOrder: 30, reactionCount: '147K' }, { timestamp: 1570510090, feedOrder: 31, reactionCount: '3' }, { timestamp: 1570482640, feedOrder: 32, reactionCount: '0' }, { timestamp: 1569960104, feedOrder: 33, reactionCount: '162K' }, { timestamp: 1570545406, feedOrder: 34, reactionCount: '12' }, { timestamp: 1570495462, feedOrder: 35, reactionCount: '2' }, { timestamp: 1570540506, feedOrder: 36, reactionCount: '0' }, { timestamp: 1570363159, feedOrder: 37, reactionCount: '193' }, { timestamp: 1570489213, feedOrder: 38, reactionCount: '8' }, { timestamp: 1570195458, feedOrder: 39, reactionCount: '93K' }, { timestamp: 1570317321, feedOrder: 40, reactionCount: '1' }, { timestamp: 1570279433, feedOrder: 41, reactionCount: '32' }, { timestamp: 1570537933, feedOrder: 42, reactionCount: '1' }, { timestamp: 1568334504, feedOrder: 43, reactionCount: '11K' }, { timestamp: 1570226531, feedOrder: 44, reactionCount: '148' }, { timestamp: 1570546335, feedOrder: 45, reactionCount: '0' }, { timestamp: 1570496272, feedOrder: 46, reactionCount: '0' }, { timestamp: 1570544032, feedOrder: 47, reactionCount: '6' }, { timestamp: 1570544172, feedOrder: 48, reactionCount: '9' }, { timestamp: 1570413498, feedOrder: 49, reactionCount: '64' }, { timestamp: 1569085201, feedOrder: 50, reactionCount: '16K' }, { timestamp: 1570535002, feedOrder: 51, reactionCount: '53' }, { timestamp: 1570475892, feedOrder: 52, reactionCount: '3' }, { timestamp: 1570539742, feedOrder: 53, reactionCount: '0' }, { timestamp: 1570347164, feedOrder: 54, reactionCount: '19' }, { timestamp: 1570467142, feedOrder: 55, reactionCount: '5' }, { timestamp: 1570468219, feedOrder: 56, reactionCount: '0' }, { timestamp: 1570543046, feedOrder: 57, reactionCount: '0' }, { timestamp: 1570027276, feedOrder: 58, reactionCount: '645K' }, { timestamp: 1569978533, feedOrder: 59, reactionCount: '14' }, { timestamp: 1570476245, feedOrder: 60, reactionCount: '1' }, { timestamp: 1569977045, feedOrder: 61, reactionCount: '65' }, { timestamp: 1570314747, feedOrder: 62, reactionCount: '47' }, { timestamp: 1570384312, feedOrder: 63, reactionCount: '15' }, { timestamp: 1570452622, feedOrder: 64, reactionCount: '5' }, { timestamp: 1570173920, feedOrder: 65, reactionCount: '327' }, { timestamp: 1570453697, feedOrder: 66, reactionCount: '47' }, { timestamp: 1570452622, feedOrder: 67, reactionCount: '5' }, { timestamp: 1570453697, feedOrder: 68, reactionCount: '47' }, { timestamp: 1570462453, feedOrder: 69, reactionCount: '26' }, { timestamp: 1570478066, feedOrder: 70, reactionCount: '327' }, { timestamp: 1570286627, feedOrder: 71, reactionCount: '34' }, { timestamp: 1570455351, feedOrder: 72, reactionCount: '4' }, { timestamp: 1570459309, feedOrder: 73, reactionCount: '3' }, { timestamp: 1570459148, feedOrder: 74, reactionCount: '12' }, { timestamp: 1567036800, feedOrder: 75, reactionCount: '361K' }, { timestamp: 1570541010, feedOrder: 76, reactionCount: '3' }, { timestamp: 1570459148, feedOrder: 77, reactionCount: '12' }, { timestamp: 1567036800, feedOrder: 78, reactionCount: '361K' }, { timestamp: 1570541010, feedOrder: 79, reactionCount: '3' }, { timestamp: 1570541549, feedOrder: 80, reactionCount: '7' }, { timestamp: 1570518407, feedOrder: 81, reactionCount: '7' }, { timestamp: 1570541010, feedOrder: 82, reactionCount: '3' }, { timestamp: 1570541549, feedOrder: 83, reactionCount: '7' }, { timestamp: 1570518407, feedOrder: 84, reactionCount: '7' }, { timestamp: 1570222787, feedOrder: 85, reactionCount: '3' }, { timestamp: 1568614314, feedOrder: 86, reactionCount: '104K' }, { timestamp: 1570505385, feedOrder: 87, reactionCount: '21' }, { timestamp: 1570533350, feedOrder: 88, reactionCount: '0' }, { timestamp: 1570518261, feedOrder: 89, reactionCount: '61' }, { timestamp: 1570534391, feedOrder: 90, reactionCount: '0' }, { timestamp: 1570501860, feedOrder: 91, reactionCount: '80' }, { timestamp: 1570497341, feedOrder: 92, reactionCount: '29' }, { timestamp: 1570513845, feedOrder: 93, reactionCount: '1' }, { timestamp: 1570494380, feedOrder: 94, reactionCount: '40' }, { timestamp: 1570311958, feedOrder: 95, reactionCount: '14' }, { timestamp: 1570220176, feedOrder: 96, reactionCount: '2.2K' }, { timestamp: 1570297627, feedOrder: 97, reactionCount: '7' }, { timestamp: 1570449523, feedOrder: 98, reactionCount: '7' }, { timestamp: 1570241089, feedOrder: 99, reactionCount: '10' }, { timestamp: 1570075144, feedOrder: 100, reactionCount: '18' }, { timestamp: 1570453435, feedOrder: 101, reactionCount: '8' }, { timestamp: 1570449921, feedOrder: 102, reactionCount: '0' }, { timestamp: 1570536610, feedOrder: 103, reactionCount: '0' }, { timestamp: 1570496926, feedOrder: 104, reactionCount: '8' }, { timestamp: 1570342649, feedOrder: 105, reactionCount: '4.5K' }, { timestamp: 1570423550, feedOrder: 106, reactionCount: '2' }], exportSeconds: 1570548550.554 };

const RAHUL_FEED = { version: '1.0.0', posts: [{ timestamp: 1570561041, feedOrder: 0, reactionCount: '11' }, { timestamp: 1570362796, feedOrder: 1, reactionCount: '177' }, { timestamp: 1570713245, feedOrder: 2, reactionCount: '23' }, { timestamp: 1570636454, feedOrder: 3, reactionCount: '1' }, { timestamp: 1570699921, feedOrder: 4, reactionCount: '6' }, { timestamp: 1570501413, feedOrder: 5, reactionCount: '11' }, { timestamp: 1570115217, feedOrder: 6, reactionCount: '0' }, { timestamp: 1570370792, feedOrder: 7, reactionCount: '70' }, { timestamp: 1570571856, feedOrder: 8, reactionCount: '9' }, { timestamp: 1570707002, feedOrder: 9, reactionCount: '20' }, { timestamp: 1570286961, feedOrder: 10, reactionCount: '25' }, { timestamp: 1570411982, feedOrder: 11, reactionCount: '40' }, { timestamp: 1570588338, feedOrder: 12, reactionCount: '9' }, { timestamp: 1570642920, feedOrder: 13, reactionCount: '4' }, { timestamp: 1570714129, feedOrder: 14, reactionCount: '0' }, { timestamp: 1570621640, feedOrder: 15, reactionCount: '54' }, { timestamp: 1570196434, feedOrder: 16, reactionCount: '40' }, { timestamp: 1570537417, feedOrder: 17, reactionCount: '5' }, { timestamp: 1570321410, feedOrder: 18, reactionCount: '24' }, { timestamp: 1570225527, feedOrder: 19, reactionCount: '24' }, { timestamp: 1570638231, feedOrder: 20, reactionCount: '7' }, { timestamp: 1570694086, feedOrder: 21, reactionCount: '19' }, { timestamp: 1570421184, feedOrder: 22, reactionCount: '106' }, { timestamp: 1570652613, feedOrder: 23, reactionCount: '22' }, { timestamp: 1570710871, feedOrder: 24, reactionCount: '1' }, { timestamp: 1570555538, feedOrder: 25, reactionCount: '15' }, { timestamp: 1570714465, feedOrder: 26, reactionCount: '9' }, { timestamp: 1570065917, feedOrder: 27, reactionCount: '41' }, { timestamp: 1570680166, feedOrder: 28, reactionCount: '11' }, { timestamp: 1570628349, feedOrder: 29, reactionCount: '24' }, { timestamp: 1570629186, feedOrder: 30, reactionCount: '14' }, { timestamp: 1570707924, feedOrder: 31, reactionCount: '17' }, { timestamp: 1570715093, feedOrder: 32, reactionCount: '0' }, { timestamp: 1570648326, feedOrder: 33, reactionCount: '19' }, { timestamp: 1570629892, feedOrder: 34, reactionCount: '40' }, { timestamp: 1570365737, feedOrder: 35, reactionCount: '1' }, { timestamp: 1570596010, feedOrder: 36, reactionCount: '22' }, { timestamp: 1570684352, feedOrder: 37, reactionCount: '4' }, { timestamp: 1570104167, feedOrder: 38, reactionCount: '42' }, { timestamp: 1570660194, feedOrder: 39, reactionCount: '3' }, { timestamp: 1570613976, feedOrder: 40, reactionCount: '8' }, { timestamp: 1570384775, feedOrder: 41, reactionCount: '11' }, { timestamp: 1570582530, feedOrder: 42, reactionCount: '19' }, { timestamp: 1570483218, feedOrder: 43, reactionCount: '14' }, { timestamp: 1570326690, feedOrder: 44, reactionCount: '49' }, { timestamp: 1570450448, feedOrder: 45, reactionCount: '59' }, { timestamp: 1570202981, feedOrder: 46, reactionCount: '26' }, { timestamp: 1570706921, feedOrder: 47, reactionCount: '3' }, { timestamp: 1570544689, feedOrder: 48, reactionCount: '57' }, { timestamp: 1570612639, feedOrder: 49, reactionCount: '7' }, { timestamp: 1570501860, feedOrder: 50, reactionCount: '104' }, { timestamp: 1570582292, feedOrder: 51, reactionCount: '18' }, { timestamp: 1570197136, feedOrder: 52, reactionCount: '19' }, { timestamp: 1570416907, feedOrder: 53, reactionCount: '18' }, { timestamp: 1570548387, feedOrder: 54, reactionCount: '3' }, { timestamp: 1570552674, feedOrder: 55, reactionCount: '25' }, { timestamp: 1570540208, feedOrder: 56, reactionCount: '63' }, { timestamp: 1570513509, feedOrder: 57, reactionCount: '18' }, { timestamp: 1570668463, feedOrder: 58, reactionCount: '13' }, { timestamp: 1570631055, feedOrder: 59, reactionCount: '107' }, { timestamp: 1570577109, feedOrder: 60, reactionCount: '1' }, { timestamp: 1570455708, feedOrder: 61, reactionCount: '69' }, { timestamp: 1570479623, feedOrder: 62, reactionCount: '6' }, { timestamp: 1570211583, feedOrder: 63, reactionCount: '35' }, { timestamp: 1570632596, feedOrder: 64, reactionCount: '11' }, { timestamp: 1570315350, feedOrder: 65, reactionCount: '0' }, { timestamp: 1570565130, feedOrder: 66, reactionCount: '6' }, { timestamp: 1570412596, feedOrder: 67, reactionCount: '14' }, { timestamp: 1570362591, feedOrder: 68, reactionCount: '28' }, { timestamp: 1570365099, feedOrder: 69, reactionCount: '130' }, { timestamp: 1570307177, feedOrder: 70, reactionCount: '20' }, { timestamp: 1570581106, feedOrder: 71, reactionCount: '45' }, { timestamp: 1570214422, feedOrder: 72, reactionCount: '2' }, { timestamp: 1570397855, feedOrder: 73, reactionCount: '30' }, { timestamp: 1570327991, feedOrder: 74, reactionCount: '35' }, { timestamp: 1570479450, feedOrder: 75, reactionCount: '4' }, { timestamp: 1570317675, feedOrder: 76, reactionCount: '39' }, { timestamp: 1570646006, feedOrder: 77, reactionCount: '4' }, { timestamp: 1570695184, feedOrder: 78, reactionCount: '9' }, { timestamp: 1570374604, feedOrder: 79, reactionCount: '65' }, { timestamp: 1570557875, feedOrder: 80, reactionCount: '15' }, { timestamp: 1570693539, feedOrder: 81, reactionCount: '13' }, { timestamp: 1570628395, feedOrder: 82, reactionCount: '2' }, { timestamp: 1570659237, feedOrder: 83, reactionCount: '4' }, { timestamp: 1570318265, feedOrder: 84, reactionCount: '20' }, { timestamp: 1570306468, feedOrder: 85, reactionCount: '20' }, { timestamp: 1570512459, feedOrder: 86, reactionCount: '8' }, { timestamp: 1570466206, feedOrder: 87, reactionCount: '18' }, { timestamp: 1570708514, feedOrder: 88, reactionCount: '1' }, { timestamp: 1570568177, feedOrder: 89, reactionCount: '32' }, { timestamp: 1570716839, feedOrder: 90, reactionCount: '2' }, { timestamp: 1570712401, feedOrder: 91, reactionCount: '1' }, { timestamp: 1570490412, feedOrder: 92, reactionCount: '51' }, { timestamp: 1570533120, feedOrder: 93, reactionCount: '41' }, { timestamp: 1570488687, feedOrder: 94, reactionCount: '6' }, { timestamp: 1570552925, feedOrder: 95, reactionCount: '3' }, { timestamp: 1570699295, feedOrder: 96, reactionCount: '19' }, { timestamp: 1570673715, feedOrder: 97, reactionCount: '3' }, { timestamp: 1570230140, feedOrder: 98, reactionCount: '5' }, { timestamp: 1570222376, feedOrder: 99, reactionCount: '119' }, { timestamp: 1570635198, feedOrder: 100, reactionCount: '6' }, { timestamp: 1570380115, feedOrder: 101, reactionCount: '17' }, { timestamp: 1570474169, feedOrder: 102, reactionCount: '37' }, { timestamp: 1570711190, feedOrder: 103, reactionCount: '1' }, { timestamp: 1570714809, feedOrder: 104, reactionCount: '2' }, { timestamp: 1570636193, feedOrder: 105, reactionCount: '0' }, { timestamp: 1570563265, feedOrder: 106, reactionCount: '0' }, { timestamp: 1570291791, feedOrder: 107, reactionCount: '42' }, { timestamp: 1570518385, feedOrder: 108, reactionCount: '5' }, { timestamp: 1570501938, feedOrder: 109, reactionCount: '11' }, { timestamp: 1570307500, feedOrder: 110, reactionCount: '17' }, { timestamp: 1570383282, feedOrder: 111, reactionCount: '1' }, { timestamp: 1570535995, feedOrder: 112, reactionCount: '29' }, { timestamp: 1570468402, feedOrder: 113, reactionCount: '23' }, { timestamp: 1570487457, feedOrder: 114, reactionCount: '12' }, { timestamp: 1570323248, feedOrder: 115, reactionCount: '10' }, { timestamp: 1570337382, feedOrder: 116, reactionCount: '27' }, { timestamp: 1570536786, feedOrder: 117, reactionCount: '24' }, { timestamp: 1570667398, feedOrder: 118, reactionCount: '34' }, { timestamp: 1570644139, feedOrder: 119, reactionCount: '5' }, { timestamp: 1570319866, feedOrder: 120, reactionCount: '6' }, { timestamp: 1570305400, feedOrder: 121, reactionCount: '5' }, { timestamp: 1570644139, feedOrder: 122, reactionCount: '5' }, { timestamp: 1570319866, feedOrder: 123, reactionCount: '6' }, { timestamp: 1570305400, feedOrder: 124, reactionCount: '5' }, { timestamp: 1570501793, feedOrder: 125, reactionCount: '2' }, { timestamp: 1570391304, feedOrder: 126, reactionCount: '16' }, { timestamp: 1570535533, feedOrder: 127, reactionCount: '13' }, { timestamp: 1570452777, feedOrder: 128, reactionCount: '4' }, { timestamp: 1570321930, feedOrder: 129, reactionCount: '82' }, { timestamp: 1570508129, feedOrder: 130, reactionCount: '1' }, { timestamp: 1570535564, feedOrder: 131, reactionCount: '22' }, { timestamp: 1570636753, feedOrder: 132, reactionCount: '7' }, { timestamp: 1570575789, feedOrder: 133, reactionCount: '21' }, { timestamp: 1570381219, feedOrder: 134, reactionCount: '5' }, { timestamp: 1570457358, feedOrder: 135, reactionCount: '38' }, { timestamp: 1570455430, feedOrder: 136, reactionCount: '66' }, { timestamp: 1570574104, feedOrder: 137, reactionCount: '7' }, { timestamp: 1570452287, feedOrder: 138, reactionCount: '14' }, { timestamp: 1570573475, feedOrder: 139, reactionCount: '12' }], exportSeconds: 1570717085.216 };

const ANNA_FEED = { version: '1.0.0', posts: [{ timestamp: 1570712415, feedOrder: 0, reactionCount: '3K' }, { timestamp: 1570362047, feedOrder: 1, reactionCount: '0' }, { timestamp: 1570677146, feedOrder: 2, reactionCount: '119' }, { timestamp: 1570717451, feedOrder: 3, reactionCount: '7' }, { timestamp: 1570596954, feedOrder: 4, reactionCount: '581' }, { timestamp: 1570661606, feedOrder: 5, reactionCount: '240' }, { timestamp: 1570578434, feedOrder: 6, reactionCount: '0' }, { timestamp: 1570561085, feedOrder: 7, reactionCount: '43' }, { timestamp: 1570601968, feedOrder: 8, reactionCount: '51' }, { timestamp: 1570500586, feedOrder: 9, reactionCount: '0' }, { timestamp: 1570509988, feedOrder: 10, reactionCount: '24' }, { timestamp: 1570599540, feedOrder: 11, reactionCount: '21' }, { timestamp: 1570664659, feedOrder: 12, reactionCount: '45' }, { timestamp: 1569604709, feedOrder: 13, reactionCount: '305' }, { timestamp: 1570595280, feedOrder: 14, reactionCount: '35' }, { timestamp: 1570598587, feedOrder: 15, reactionCount: '28K' }, { timestamp: 1570235195, feedOrder: 16, reactionCount: '16' }, { timestamp: 1570660813, feedOrder: 17, reactionCount: '22' }, { timestamp: 1570671000, feedOrder: 18, reactionCount: '11' }, { timestamp: 1570649871, feedOrder: 19, reactionCount: '31' }, { timestamp: 1570639199, feedOrder: 20, reactionCount: '2' }, { timestamp: 1570273747, feedOrder: 21, reactionCount: '22' }, { timestamp: 1570473692, feedOrder: 22, reactionCount: '12' }, { timestamp: 1570494463, feedOrder: 23, reactionCount: '12' }, { timestamp: 1570430595, feedOrder: 24, reactionCount: '19K' }, { timestamp: 1569584929, feedOrder: 25, reactionCount: '853' }, { timestamp: 1570645293, feedOrder: 26, reactionCount: '1.1K' }, { timestamp: 1570537937, feedOrder: 27, reactionCount: '17' }, { timestamp: 1570551896, feedOrder: 28, reactionCount: '17' }, { timestamp: 1570532807, feedOrder: 29, reactionCount: '8' }, { timestamp: 1570496012, feedOrder: 30, reactionCount: '70' }, { timestamp: 1570622352, feedOrder: 31, reactionCount: '668' }, { timestamp: 1570661659, feedOrder: 32, reactionCount: '128' }, { timestamp: 1570643518, feedOrder: 33, reactionCount: '6' }, { timestamp: 1570689872, feedOrder: 34, reactionCount: '18' }, { timestamp: 1570473645, feedOrder: 35, reactionCount: '0' }, { timestamp: 1570719833, feedOrder: 36, reactionCount: '0' }, { timestamp: 1570712651, feedOrder: 37, reactionCount: '4.5K' }, { timestamp: 1570560566, feedOrder: 38, reactionCount: '23' }, { timestamp: 1570622855, feedOrder: 39, reactionCount: '2.5K' }, { timestamp: 1570402540, feedOrder: 40, reactionCount: '79' }, { timestamp: 1570478868, feedOrder: 41, reactionCount: '25' }, { timestamp: 1570492080, feedOrder: 42, reactionCount: '28' }, { timestamp: 1570625027, feedOrder: 43, reactionCount: '16' }, { timestamp: 1570493120, feedOrder: 44, reactionCount: '22' }, { timestamp: 1570556262, feedOrder: 45, reactionCount: '165' }, { timestamp: 1570283420, feedOrder: 46, reactionCount: '49' }, { timestamp: 1570670109, feedOrder: 47, reactionCount: '35' }, { timestamp: 1570655060, feedOrder: 48, reactionCount: '1' }, { timestamp: 1570502279, feedOrder: 49, reactionCount: '16' }, { timestamp: 1570666045, feedOrder: 50, reactionCount: '1.9K' }, { timestamp: 1570581334, feedOrder: 51, reactionCount: '23' }, { timestamp: 1570592916, feedOrder: 52, reactionCount: '8' }, { timestamp: 1570196914, feedOrder: 53, reactionCount: '344' }, { timestamp: 1570601728, feedOrder: 54, reactionCount: '1' }, { timestamp: 1570486750, feedOrder: 55, reactionCount: '12' }, { timestamp: 1570508535, feedOrder: 56, reactionCount: '4' }, { timestamp: 1570687717, feedOrder: 57, reactionCount: '17' }, { timestamp: 1570237416, feedOrder: 58, reactionCount: '47' }, { timestamp: 1570119399, feedOrder: 59, reactionCount: '123' }, { timestamp: 1570386835, feedOrder: 60, reactionCount: '203' }, { timestamp: 1570487598, feedOrder: 61, reactionCount: '25' }, { timestamp: 1570645816, feedOrder: 62, reactionCount: '4' }, { timestamp: 1570677092, feedOrder: 63, reactionCount: '52' }, { timestamp: 1570657653, feedOrder: 64, reactionCount: '3.7K' }, { timestamp: 1570642615, feedOrder: 65, reactionCount: '232' }, { timestamp: 1570645803, feedOrder: 66, reactionCount: '34' }, { timestamp: 1570473968, feedOrder: 67, reactionCount: '3' }, { timestamp: 1570685657, feedOrder: 68, reactionCount: '13' }, { timestamp: 1570654576, feedOrder: 69, reactionCount: '3' }, { timestamp: 1570711921, feedOrder: 70, reactionCount: '25' }, { timestamp: 1570666525, feedOrder: 71, reactionCount: '5' }, { timestamp: 1570275946, feedOrder: 72, reactionCount: '386' }, { timestamp: 1570635727, feedOrder: 73, reactionCount: '4' }, { timestamp: 1570409180, feedOrder: 74, reactionCount: '5' }, { timestamp: 1570564071, feedOrder: 75, reactionCount: '47' }, { timestamp: 1570448311, feedOrder: 76, reactionCount: '5.2K' }, { timestamp: 1570712338, feedOrder: 77, reactionCount: '389' }, { timestamp: 1570484095, feedOrder: 78, reactionCount: '2.7K' }, { timestamp: 1570491729, feedOrder: 79, reactionCount: '18' }, { timestamp: 1570622814, feedOrder: 80, reactionCount: '465' }, { timestamp: 1570718532, feedOrder: 81, reactionCount: '23' }, { timestamp: 1570584526, feedOrder: 82, reactionCount: '12' }, { timestamp: 1570408430, feedOrder: 83, reactionCount: '15' }, { timestamp: 1570680150, feedOrder: 84, reactionCount: '16K' }, { timestamp: 1570660205, feedOrder: 85, reactionCount: '6' }, { timestamp: 1570706155, feedOrder: 86, reactionCount: '13' }, { timestamp: 1570647996, feedOrder: 87, reactionCount: '105' }, { timestamp: 1570570125, feedOrder: 88, reactionCount: '8' }, { timestamp: 1570568744, feedOrder: 89, reactionCount: '13' }, { timestamp: 1570628780, feedOrder: 90, reactionCount: '2' }, { timestamp: 1570716438, feedOrder: 91, reactionCount: '3' }, { timestamp: 1570713299, feedOrder: 92, reactionCount: '58' }, { timestamp: 1570461663, feedOrder: 93, reactionCount: '9' }, { timestamp: 1570714641, feedOrder: 94, reactionCount: '1' }, { timestamp: 1570451290, feedOrder: 95, reactionCount: '155' }, { timestamp: 1570653044, feedOrder: 96, reactionCount: '431' }, { timestamp: 1570592421, feedOrder: 97, reactionCount: '77' }, { timestamp: 1570655618, feedOrder: 98, reactionCount: '2' }, { timestamp: 1570471721, feedOrder: 99, reactionCount: '18K' }, { timestamp: 1570496106, feedOrder: 100, reactionCount: '12' }, { timestamp: 1570387305, feedOrder: 101, reactionCount: '8.6K' }, { timestamp: 1570459624, feedOrder: 102, reactionCount: '75' }, { timestamp: 1570373380, feedOrder: 103, reactionCount: '93' }, { timestamp: 1570468757, feedOrder: 104, reactionCount: '2' }, { timestamp: 1570480559, feedOrder: 105, reactionCount: '0' }, { timestamp: 1570388283, feedOrder: 106, reactionCount: '74' }], exportSeconds: 1570719912.311 };


class GridVis extends Component {
  constructor(props) {
    super(props);

    const dim = 30;
    const cols = 10;
    const day = 86400;

    this.preprocessPosts(ETHAN_FEED);
    this.preprocessPosts(DENNIS_FEED);
    this.preprocessPosts(RAHUL_FEED);
    this.preprocessPosts(ANNA_FEED);

    this.state = {
      staleColor: '#4267b2',
      freshColor: '#dddddd',
      mainFeed: ETHAN_FEED,
      feedB: RAHUL_FEED,
      feedC: ANNA_FEED,
      feedD: DENNIS_FEED,
      postWidth: 400,
      barWidth: 3,
      day,
      cols,
      dim,
    };
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    if (this.props.activeSection === 'START') {
      this.transitionToPosts();
    } else if (this.props.activeSection === 'DATES') {
      this.transitionToDates();
    } else if (this.props.activeSection === 'BLOCKS') {
      this.transitionToBlocks();
    } else if (this.props.activeSection === 'START_GRID') {
      this.transitionToGrid();
    } else if (this.props.activeSection === 'SORT_BY_TIME') {
      this.transitionToOrdered();
    } else if (this.props.activeSection === 'ONE_HISTOGRAM') {
      this.transitionToOneHistogram();
    } else if (this.props.activeSection === 'ALL_HISTOGRAMS') {
      this.transitionToAllHistograms();
    } else if (this.props.activeSection === 'CREDITS') {
      this.hideAll();
    }
  }

  preprocessPosts = (feed) => {
    // eslint-disable-next-line no-param-reassign
    feed.posts = feed.posts.slice(0, 100);
    this.randomizePostContent(feed.posts);
    this.computeSortIndices(feed.posts);
    this.computeStaleness(feed.posts, feed.exportSeconds);
  }

  randomizePostContent = (posts) => {
    posts.forEach((post) => {
      const postType = Math.random() < 0.2 ? 'image' : 'text';
      // eslint-disable-next-line no-param-reassign
      post.postType = postType;
      // eslint-disable-next-line no-param-reassign
      post.postHeight = postType === 'image' ? 180 : 80;
    });
  }

  computeSortIndices = (posts) => {
    const sortedIndices = this.sortWithIndices(posts);
    sortedIndices.forEach((i, order) => {
      // eslint-disable-next-line no-param-reassign
      posts[i].categoryOrder = order;
    });
  }

  computeStaleness = (posts, exportSeconds) => {
    const day = 86400;
    posts.forEach((post) => {
      // eslint-disable-next-line no-param-reassign
      post.stale = post.timestamp < (exportSeconds - day);
    });
  }

  sortWithIndices = (posts) => {
    const toSort = [...posts];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < toSort.length; i++) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort((left, right) => (left[0].timestamp < right[0].timestamp ? -1 : 1));
    const sortIndices = [];
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < toSort.length; j++) {
      sortIndices.push(toSort[j][1]);
    }
    return sortIndices;
  }

  createChart = () => {
    const { mainFeed, feedB, feedC, feedD, postWidth } = this.state;
    let nextY = 0;
    const postSpacing = 20;
    const componentFillColor = '#888888';
    const componentOutlineColor = 'gray';

    d3.select('.feed')
      .attr('transform', () => {
        const bBox = d3.select('.mainCanvas').node().getBoundingClientRect();
        const x = Math.round(bBox.width * 0.5) - Math.round(postWidth * 0.5);
        return `translate(${x}, 50)`;
      });

    d3.selectAll('.mainCanvas')
      .attr('opacity', 1);

    const postGroups = d3.select('.grid')
      .selectAll('.postGroup')
      .data(mainFeed.posts)
      .enter()
      .append('g')
      .attr('class', 'post')
      .attr('transform', (d) => {
        const y = nextY;
        nextY += d.postHeight + postSpacing;
        return `translate(0,${y})`;
      });

    postGroups.append('rect')
      .attr('class', 'postFrame')
      .attr('width', postWidth)
      .attr('height', d => d.postHeight)
      .attr('fill', this.state.freshColor)
      .attr('stroke', 'gray')
      .attr('stroke-width', 1)
      .attr('x', 0);

    postGroups.filter(d => d.postType === 'image')
      .append('rect')
      .attr('class', 'postImage postContent')
      .attr('width', postWidth - 20)
      .attr('height', 100)
      .attr('stroke', componentOutlineColor)
      .attr('stroke-width', 1)
      .attr('fill', componentFillColor)
      .attr('x', 10)
      .attr('y', 70)
      .attr('opacity', 1);

    [55, 62, 69].forEach((y) => {
      postGroups.filter(d => d.postType === 'text')
        .append('line')
        .attr('class', 'postText postContent')
        .attr('stroke', componentOutlineColor)
        .attr('stroke-width', 5)
        .attr('x1', 10)
        .attr('y1', y)
        .attr('x2', postWidth - 20)
        .attr('y2', y)
        .attr('opacity', 1);
    });

    postGroups.append('circle')
      .attr('class', 'postAvatar postContent')
      .attr('cx', 30)
      .attr('cy', 30)
      .attr('fill', componentFillColor)
      .attr('stroke', componentOutlineColor)
      .attr('stroke-width', 1)
      .attr('r', 20)
      .attr('opacity', 1);

    postGroups.append('text')
      .attr('class', 'postLabel')
      .text(d => (new Date(d.timestamp * 1000)).toDateString())
      .attr('font-size', '20px')
      .attr('fill', 'transparent')
      .attr('x', 60)
      .attr('y', 35);

    this.renderHistogramLabels(mainFeed, '.sectionA', '.histogramLabels')
      .attr('opacity', 0);

    this.renderHistogram(feedB, '.sectionB', '.gridB');
    this.renderHistogram(feedC, '.sectionC', '.gridC');
    this.renderHistogram(feedD, '.sectionD', '.gridD');

    d3.select('.legend')
      .attr('opacity', 0);
  }

  transitionToPosts = () => {
    d3.select('.legend')
      .transition()
      .duration(1000)
      .attr('opacity', 0);

    d3.selectAll('.postLabel')
      .transition()
      .duration(1000)
      .attr('fill', 'transparent');

    d3.select('.grid')
      .selectAll('.postFrame')
      .transition()
      .duration(1000)
      .attr('fill', this.state.freshColor);
  }

  transitionToDates = () => {
    const { postWidth } = this.state;

    d3.selectAll('.postLabel')
      .transition()
      .duration(1000)
      .attr('fill', 'black');

    let nextY = 0;
    d3.select('.grid')
      .selectAll('.post')
      .transition()
      .duration(1000)
      .attr('transform', (d) => {
        const y = nextY;
        nextY += d.postHeight + 20;
        return `translate(0,${y})`;
      });

    d3.select('.grid')
      .selectAll('.postFrame')
      .transition()
      .duration(1000)
      .attr('fill', d => (d.stale ? this.state.staleColor : this.state.freshColor))
      .attr('width', postWidth)
      .attr('height', d => d.postHeight);

    d3.selectAll('.postContent')
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    d3.selectAll('.postContent')
      .filter(d => d.postType === 'image')
      .attr('width', postWidth - 20)
      .attr('height', 100);
  }

  transitionToBlocks = () => {
    const { dim } = this.state;

    d3.select('.legend')
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    d3.select('.grid')
      .selectAll('.post')
      .transition()
      .duration(1000)
      .attr('transform', (d, i) => `translate(0,${i * dim})`);

    d3.selectAll('.postLabel')
      .transition()
      .duration(1000)
      .attr('fill', 'transparent');

    d3.selectAll('.postContent')
      .transition()
      .duration(1000)
      .attr('opacity', 0);

    d3.selectAll('.postContent')
      .filter(d => d.postType === 'image')
      .attr('width', 0)
      .attr('height', 0);

    d3.select('.grid')
      .selectAll('.postFrame')
      .transition()
      .duration(1000)
      .attr('width', dim)
      .attr('height', dim);
  }

  transitionToGrid = () => {
    const { cols, dim } = this.state;

    d3.select('.grid')
      .selectAll('.post')
      .transition()
      .duration(1000)
      .attr('transform', (d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return `translate(${col * dim},${row * dim})`;
      });
  }

  transitionToOrdered = () => {
    const { cols, dim } = this.state;

    d3.select('.grid')
      .selectAll('.post')
      .transition()
      .duration(1000)
      .attr('transform', (d) => {
        const col = d.categoryOrder % cols;
        const row = Math.floor(d.categoryOrder / cols);
        return `translate(${col * dim},${row * dim})`;
      });

    d3.select('.grid')
      .selectAll('.postFrame')
      .transition()
      .duration(1000)
      .attr('width', dim)
      .attr('stroke-width', 1);

    ['.histogramLabel', '.sectionB', '.sectionC', '.sectionD'].forEach((selector) => {
      d3.selectAll(selector)
        .transition()
        .duration(500)
        .attr('opacity', 0);
    });
  }

  transitionToOneHistogram = () => {
    const { barWidth } = this.state;
    let staleX = 0;
    let recentX = 0;
    const staleY = 0;
    const recentY = 30;

    d3.select('.grid')
      .selectAll('.post')
      .transition()
      .duration(1000)
      .attr('transform', (d) => {
        let x;
        if (d.stale) {
          x = staleX;
          staleX += barWidth;
        } else {
          x = recentX;
          recentX += barWidth;
        }
        return `translate(${x},${d.stale ? staleY : recentY})`;
      });

    d3.select('.grid')
      .selectAll('.postFrame')
      .transition()
      .duration(1000)
      .attr('width', barWidth)
      .attr('stroke-width', 0);
  }

  transitionToAllHistograms = () => {
    ['.mainCanvas', '.histogramLabel', '.sectionB', '.sectionC', '.sectionD'].forEach((selector) => {
      d3.selectAll(selector)
        .transition()
        .duration(1000)
        .attr('opacity', 1);
    });
  }

  hideAll = () => {
    d3.selectAll('.mainCanvas')
      .transition()
      .duration(1000)
      .attr('opacity', 0);
  }

  renderHistogram = (feed, section, grid) => {
    const { dim, barWidth } = this.state;
    let staleX = 0;
    let recentX = 0;
    const staleY = 0;
    const recentY = 30;
    d3.select(section)
      .attr('opacity', 0)
      .select(grid)
      .selectAll('rect')
      .data(feed.posts)
      .enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', dim)
      .attr('fill', d => (d.stale ? this.state.staleColor : this.state.freshColor))
      .attr('stroke-width', 0)
      .attr('x', (d) => {
        let x;
        if (d.stale) {
          x = staleX;
          staleX += barWidth;
        } else {
          x = recentX;
          recentX += barWidth;
        }
        return x;
      })
      .attr('y', (d) => {
        if (d.stale) {
          return staleY;
        }
        return recentY;
      });

    this.renderHistogramLabels(feed, section, grid);
  }

  renderHistogramLabels = (feed, section, grid) => {
    const recentPosts = feed.posts.filter(post => !post.stale);
    return d3.select(section)
      .select(grid)
      .selectAll('text')
      .data([feed.posts.length - recentPosts.length, recentPosts.length])
      .enter()
      .append('text')
      .attr('class', 'histogramLabel')
      .text(d => `${d}/${feed.posts.length}`)
      .attr('y', (d, i) => 20 + (30 * i));
  }

  render() {
    const width = '100%';

    return (
      <svg className="mainCanvas" width={width} height="100%">
        <g className="feed">
          <g transform="translate(0,20)" id="grid" className="legend">
            <rect fill={`${this.state.freshColor}`} width="20" height="20" x="0" y="0" />
            <text x="25" y="15">Recent</text>
            <rect fill={`${this.state.staleColor}`} width="20" height="20" x="80" y="0" />
            <text x="105" y="15">Stale</text>
          </g>
          <g transform="translate(0,25)" className="sectionA">
            <g transform="translate(0,25)" className="grid" />
            <g transform="translate(0,25)" className="histogramLabels" />
          </g>
          <g transform="translate(0,130)" className="sectionB">
            <text x="0" y="15">User B's Feed</text>
            <g transform="translate(0,25)" className="gridB" />
          </g>
          <g transform="translate(0,240)" className="sectionC">
            <text x="0" y="15">User C's Feed</text>
            <g transform="translate(0,25)" className="gridC" />
          </g>
          <g transform="translate(0,350)" className="sectionD">
            <text x="0" y="15">User D's Feed</text>
            <g transform="translate(0,25)" className="gridD" />
          </g>
        </g>
      </svg>
    );
  }
}

GridVis.propTypes = {
  activeSection: PropTypes.string.isRequired,
};

export default GridVis;
