import React from 'react';
import cuid from 'cuid';
import { Form, FormikProps, Field, withFormik, ErrorMessage } from 'formik';
import { Article } from 'MyModels';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { createArticleAsync, updateArticleAsync } from '../actions';
import { getPath } from '../../../router-paths';

type FormValues = Pick<Article, 'title' | 'content'> & {};

const dispatchProps = {
  createArticle: (values: Article) =>
    createArticleAsync.request({
      ...values,
    }),
  updateArticle: (values: Article) =>
    updateArticleAsync.request({
      ...values,
    }),
  redirectToView: (articleId : string) => push(getPath('viewArticle', articleId)),
};

type Props = typeof dispatchProps & {
  article?: Article;
};

const InnerForm: React.FC<Props & FormikProps<FormValues>> = props => {
  const { isSubmitting, dirty } = props;
  return (
    <Form>
      <div>
        <label htmlFor="title">Title</label>
        <br />
        <Field
          name="title"
          placeholder="Title"
          component="input"
          type="text"
          required
          autoFocus
        />
        <ErrorMessage name="title" />
      </div>

      <div>
        <label htmlFor="title">Content</label>
        <br />
        <Field
          name="content"
          placeholder="Article content"
          component="textarea"
          required
          type="text"
        />
        <ErrorMessage name="content" />
      </div>

      <button type="submit" disabled={!dirty || isSubmitting}>
        Submit
      </button>
    </Form>
  );
};

export default compose(
  connect(
    null,
    dispatchProps
  ),
  withFormik<Props, FormValues>({
    enableReinitialize: true,
    // initialize values
    mapPropsToValues: ({ article: data }) => ({
      title: (data && data.title) || '',
      content: (data && data.content) || '',
    }),
    handleSubmit: (values, form) => {
      let newAId = undefined;
      if (form.props.article != null) {
        newAId = form.props.article.id
        form.props.updateArticle({ ...form.props.article, ...values });
      } else {
        newAId = cuid()
        let newValues = {id: newAId, ...values}
        form.props.createArticle(newValues);
      }
      form.props.redirectToView(newAId);
      form.setSubmitting(false);
    },
  })
)(InnerForm);
