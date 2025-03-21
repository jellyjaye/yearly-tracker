knitr::opts_chunk$set(echo = FALSE) 
install.packages("kableExtra")
library(haven)
library(glmnet)
library(dplyr)
library(knitr)

# load the data
d <- haven::read_dta("~/downloads/MY474_45868_summative1/oxis2019ukda.dta")

# create a table showing different kinds of respondents and print it
usenet_table <- data.frame(
  Category = c("Users", "Ex-users", "Non-users"),
  Count = as.numeric(table(d$usenet)),
  Percentage = round(prop.table(table(d$usenet)) * 100, 2)
)
print(usenet_table)

d$agai <- ifelse(d$agai < 3, 1, 0) # <3, AI is bad, marked as 1; >=3, AI is not bad, marked as 0
table(d$agai) # check the proportions

# calculate the missing data proportions for every feature
na_proportions <- colMeans(is.na(d)) * 100
print(summary(na_proportions))

# find features with 95% or more missing data
high_na_features <- names(na_proportions[na_proportions > 95])

# delete these features and print the result
d <- d[, !names(d) %in% high_na_features]
cat("\ndeleted", length(high_na_features), "features")
cat("\nremain features：", ncol(d))

# 检查每个变量的具体情况
for(col in names(d)) {
  var_values <- unique(d[[col]])
  na_count <- sum(is.na(d[[col]]))
  zero_present <- 0 %in% var_values
  
  # 只显示有潜在问题的变量
  if(na_count > 0 || zero_present) {
    cat("\n变量:", col)
    cat("\n类型:", class(d[[col]]))
    cat("\nNA数量:", na_count)
    cat("\n包含0:", zero_present)
    cat("\n值分布:\n")
    print(table(d[[col]], useNA = "ifany"))
    cat("\n-------------------")
  }
}

# 特别关注同时包含0和NA的变量
problem_vars <- sapply(d, function(x) {
  is.numeric(x) && (0 %in% x) && any(is.na(x))
})

cat("\n\n同时包含0和NA的变量：\n")
print(names(d)[problem_vars])

# 检查每个变量的唯一值数量
unique_counts <- sapply(d, function(x) length(unique(na.omit(x))))

# 找出单类别变量
single_category_vars <- names(unique_counts[unique_counts == 1])

# 打印结果
cat("单类别变量：\n")
if(length(single_category_vars) > 0) {
  for(var in single_category_vars) {
    cat(sprintf("%s: 唯一值 = %s\n", 
                var, 
                unique(na.omit(d[[var]]))))
  }
  
  # 打印单类别变量的数量
  cat("\n总共发现", length(single_category_vars), "个单类别变量")
} else {
  cat("没有发现单类别变量")
}

# 如果需要，可以删除这些变量
if(length(single_category_vars) > 0) {
  d <- d[, !names(d) %in% single_category_vars]
  cat("\n\n这些变量已被删除")
  cat("\n剩余变量数量：", ncol(d))
}


X <- model.matrix(agai ~ ., data = d)[,-1] # 去掉自动生成的截距列
y <- d$agai