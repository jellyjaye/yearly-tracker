require(dplyr)
require(igraph)

# Code to generate the networks:
setwd("~/Downloads/45868_MY461_Week57")
meta <- read.csv("meta_eurovision.csv", header=TRUE, as.is=TRUE, stringsAsFactors=FALSE)
euro_5pub <- read.csv("euro_public_count_18-23.csv", header=TRUE, as.is=TRUE, stringsAsFactors=FALSE)
euro_5jury <- read.csv("euro_jury_count_18-23.csv", header=TRUE, as.is=TRUE, stringsAsFactors=FALSE)

net_5pub <- graph_from_data_frame(euro_5pub, directed=TRUE)
net_5jury <- graph_from_data_frame(euro_5jury, directed=TRUE)

## Creating a new dataframe to which we can append the metadata, 
## appropriately aligned with the order of the nodes in the networks
last5_df <- data.frame(Country = V(net_5pub)$name)
last5_df <- merge(last5_df, meta, by="Country", sort=FALSE)

## Again creating the networks, 
## this time adding all node attributes through the "vertices" element 
net_5pub <- graph_from_data_frame(euro_5pub, vertices = last5_df)
net_5jury <- graph_from_data_frame(euro_5jury, vertices = last5_df)

## As above, now for the 1957-2023 jury network
euro_alljury <- read.csv("euro_sum_jury_points.csv", header=TRUE, as.is=TRUE, stringsAsFactors=FALSE)
net_alljury <- graph_from_data_frame(euro_alljury)
alljury_df <- data.frame(Country = V(net_alljury)$name)
alljury_df <- merge(alljury_df, meta, by ="Country", sort=FALSE)
net_alljury <- graph_from_data_frame(euro_alljury, vertices = alljury_df)

library(igraph)

# create colors based on the Region variable
l5_regions <- levels(as.factor(V(net_5jury)$Region))  
l5region_colors <- rainbow(length(l5_regions)) 

# calculate the edge weights and strength
edge_weights <- E(net_5jury)$Count
node_strength <- strength(net_5jury, mode = "in", weights = edge_weights)  

# set page margins
par(mar = c(0,0,2,0))  
plot(net_5jury,
     layout = as.matrix(cbind(V(net_5jury)$capital.lon, V(net_5jury)$capital.lat)),
     vertex.size = sqrt(node_strength) *3,
     vertex.color = l5region_colors[match(V(net_5jury)$Region, l5_regions)],
     edge.width = edge_weights * 0.5,
     edge.arrow.size = 0.3,
     vertex.label.cex = 0.5,
     vertex.label.color = "black",
     main = "2018-2023 Jury Network")

# add a legend
present_regions <- unique(V(net_5jury)$Region)
legend("bottomleft", 
       legend = present_regions,
       fill = region_colors[match(present_regions, l5_regions)],
       title = "Region Distribution",
       cex = 0.7,
       bg = rgb(1,1,1,0.8)) 
