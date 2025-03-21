find_rmod <- function(y, X) {
  # Load the package
  install.packages("pROC")
  library(glmnet)
  library(pROC)
  
  # Create an X-matrix with possible interaction and polynomial terms
  X_mat <- model.matrix(~.^2 + poly(., degree=7, raw=TRUE), data=X)[,-1]
  
  # Create a 5-fold cross validation
  n <- nrow(X)
  k <- 5
  folds <- sample(rep(1:k, length.out = n))
  
  # Create a sequence of lambda, set the range [10^(-2), 10^(5)] to suit for the expansion in feature dimensions
  lambda_seq <- 10^seq(-2, 5, length.out = 100)
  
  # Prepare a matrix to record cross validation AUCs
  cv_aucs <- matrix(NA, nrow=k, ncol=length(lambda_seq))
  
  # Perform the cross validation
  for(i in 1:k) {
    train_X <- which(folds != i)
    test_X <- which(folds == i) 
    
    # Use ridge regression to train the model on train_X
    for(j in seq_along(lambda_seq)) {
      fit <- glmnet(X_mat[train_X,], 
                    y[train_X], 
                    alpha=0, 
                    lambda=lambda_seq[j], 
                    family="binomial")
      
      # Predict on test_X
      pred <- predict(fit, newx=X_mat[test_X,], type="response")
      
      # Calculate AUC for each fold with each lambda
      cv_aucs[i,j] <- auc(y[test_X], pred)
    }
  }
  
  # Calculate the mean errors for each lambda over all folds
  mean_cv_errors <- colMeans(cv_errors)
  
  # Choose the best lambda
  best_lambda_idx <- which.min(mean_cv_errors)
  best_lambda <- lambda_seq[best_lambda_idx]

  # Generate the final model with the best lambda
  final_model <- glmnet(X_mat, y, alpha=0, lambda=best_lambda, family="binomial")
  
  # Calculate the standard error for MSE, to estimate the performance on out-of-sample data
  mse_mean <- mean_cv_errors[best_lambda_idx]
  mse_sd <- sd(cv_errors[, best_lambda_idx])
  mse_se <- mse_sd / sqrt(k)
  
  # Get the terms in the final model
  coef_matrix <- coef(final_model)
  selected_vars <- rownames(coef_matrix)[which(coef_matrix != 0)]
  
  # Print the selected terms, lambda, and the estimated performance
  cat("Selected Terms:", paste(selected_vars, collapse = ", "), "\n")
  cat("Best lambda:", best_lambda, "\n")
  cat("Estimated out-of-sample MSE:", round(mse_mean, 4),
      "±", round(mse_se, 4), "(SE)\n")
  
  # Return the final trained model object
  return(final_model)
}

