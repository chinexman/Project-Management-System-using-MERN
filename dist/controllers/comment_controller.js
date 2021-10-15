"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.addComment = void 0;
const task_1 = __importDefault(require("../models/task"));
const joi_1 = __importDefault(require("joi"));
const comments_1 = __importDefault(require("../models/comments"));
async function addComment(req, res) {
    var _a;
    const commentSchemaJoi = joi_1.default.object({
        comment: joi_1.default.string().required(),
    });
    console.log(req.body);
    const validationResult = commentSchemaJoi.validate(req.body);
    //check for errors
    if (validationResult.error) {
        return res.status(400).json({
            msg: validationResult.error.details[0].message,
        });
    }
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const task = await task_1.default.findById(req.params.id);
    console.log(task);
    if (!task) {
        return res.status(404).json({
            msg: "You can't add comment to this task. Task does not exist.",
        });
    }
    const newComment = await comments_1.default.create({
        body: req.body.comment,
        commenter: user_id
    });
    //add comment to task
    task.comments.push(newComment._id);
    task.save();
    return res.status(200).json({
        msg: "comment added successfully",
        task: task,
    });
}
exports.addComment = addComment;
async function updateComment(req, res) {
    const CommentId = req.params.comment;
    const commentSchemaJoi = joi_1.default.object({
        comment: joi_1.default.string(),
    });
    const validationResult = commentSchemaJoi.validate(req.body);
    //check for errors
    if (validationResult.error) {
        return res.status(400).json({
            msg: validationResult.error.details[0].message,
        });
    }
    const { comment } = req.body;
    const getComment = await comments_1.default.findOne({
        _id: CommentId,
        owner: req.user._id,
    });
    if (!getComment) {
        return res.status(404).json({
            msg: "Comment with the title does not exists for that particular user",
        });
    }
    let updatedComment = await comments_1.default.findOneAndUpdate({ owner: req.user._id }, {
        body: comment ? comment : getComment.comment,
    }, { new: true });
    res.status(200).json({
        status: "success",
        data: updatedComment,
    });
}
exports.updateComment = updateComment;
async function deleteComment(req, res) {
    const user = req.user;
    const comment_id = req.params.id;
    if (!(await comments_1.default.exists({
        _id: comment_id,
    }))) {
        return res.status(404).json({
            message: "Comment does not exist!",
        });
    }
    if (!(await comments_1.default.exists({
        _id: comment_id,
        owner: user._id,
    }))) {
        return res.status(403).json({
            message: "You are not authorized to delete this comment.",
        });
    }
    const deletedComment = await comments_1.default.findOneAndDelete({
        _id: comment_id,
        owner: user._id,
    });
    res.status(200).json({
        message: "comment Deleted successfully",
        deletedComment,
    });
}
exports.deleteComment = deleteComment;
