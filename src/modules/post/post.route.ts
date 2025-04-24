import { Route } from "core/interface";
import { Router } from "express";
import PostController from "./post.controller";
import validatorMiddleware from "../../core/middleware/validation.middleware";
import CreatePostDto from "./dtos/create_post.dto";
import { authMiddleware } from "../../core/middleware";
import CreateCommentDto from "./dtos/create_comment.dto";
// import AddExperienceDto from "./dto/add_experience.dto";
// import AddEducationDto from "./dto/add_education.dto";

export default class PostRoute implements Route {
  public path = "/api/post";
  public router = Router();

  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validatorMiddleware(CreatePostDto, true),
      this.postController.createPost
    );
    this.router.put(
      this.path + "/:id",
      authMiddleware,
      validatorMiddleware(CreatePostDto, true),
      this.postController.updatePost
    );
    this.router.delete(
      this.path + "/:id",
      authMiddleware,
      this.postController.deletePost
    );
    this.router.put(
      this.path + "/like/:id",
      authMiddleware,
      this.postController.likePost
    );
    this.router.put(
      this.path + "/unlike/:id",
      authMiddleware,
      this.postController.unLikePost
    );
    this.router.put(
      this.path + "/share/:id",
      authMiddleware,
      this.postController.sharePost
    );
    this.router.put(
      this.path + "/unshare/:id",
      authMiddleware,
      this.postController.unSharePost
    );
    this.router.get(this.path, this.postController.getPostPagination);
    this.router.put(
      this.path + "/comment/:id",
      authMiddleware,
      validatorMiddleware(CreateCommentDto, true),
      this.postController.addComment
    );
    this.router.put(
      this.path + "/comment/:id/:cmtId",
      authMiddleware,
      this.postController.removeComment
    );
  }
}
