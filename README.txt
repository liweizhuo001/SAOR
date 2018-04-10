Copyright 2018 by Academy of Mathematics and Systems Science Chinese Academy of Sciences and Southeast University

SAOR (Semi-Automatic Ontology (mapping) Revision) is a web tool of SAMR for interactive mapping revision. We equip it with partially automatized process to reduce the effort of manual evaluation.

Time: 4/4/2018  Author: Weizhuo Li and Xuefeng Fu  Mail: liweizhuo2014@amss.ac.cn  or  fxf@nit.edu.cn

Software: Java 1.7 or higher. Hardware: 4GB RAM or more. 

Data sets: 
We just provide two ontologies and their alignment for testing demo. The whole dataset and alignment should be downloaded in the our soucre code (SAMR) or Ontology Alignment Evaluation Initiative (OAEI) http://oaei.ontologymatching.org/.  We also provide the service for online uploading ontologies and alignments, which is listed in the upper right corner of "Operation".

Usage:
1)you need to install the Tomcat 7 or higher version firstly, and copy the SAOR to the folder "webapps" in Tomcat.

b)Open http://localhost:8080/SAOR/ .

c)Select two ontologies and click the select buttons.

d)Select "SemiAutoRepair" in the upper right corner of "Operation".

e)Choose the mapping, referenceAlignment and the path of output.

f)Finish the interactive mapping revision. The screenshots attached to the project roughly show the face of SAOR. 


Problem&Instructions:
The real name of project is call "SAOR", so you should keep this name in webapps file in right!
The default interface of Tomcat is 8080, so you should promise the interfaces of SemiRep.jsp and WebSocketDemo.jsp are consistent with the interface of Tomcat.

